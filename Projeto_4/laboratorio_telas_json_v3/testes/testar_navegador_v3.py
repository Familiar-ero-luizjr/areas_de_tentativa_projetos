import asyncio, json, pathlib, tempfile
from playwright.async_api import async_playwright

ROOT=pathlib.Path(__file__).resolve().parents[1]
HTML=ROOT/'saida'/'advogadoja_laboratorio_telas_v3.html'
ART=pathlib.Path(tempfile.mkdtemp(prefix='qa_lab_v3_'))
ART.mkdir(exist_ok=True)
async def main():
    async with async_playwright() as p:
        browser=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        page=await browser.new_page(viewport={'width':1520,'height':950},accept_downloads=True)
        errors=[];requests=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('request',lambda r:requests.append(r.url) if not r.url.startswith('file:') else None)
        await page.set_content(HTML.read_text('utf-8'),wait_until='load');await page.wait_for_timeout(400)
        assert await page.locator('#canvas-path').inner_text()=='auth.sessao.entrar'
        assert await page.locator('#mode-tree').count()==1
        await page.locator('#mode-tree').click()
        await page.wait_for_timeout(300)
        assert await page.locator('#tree-page').is_visible()
        assert not await page.locator('#simulator-workspace').is_visible()
        assert await page.locator('.tree-screen-section').count()==3
        print('TELAS',await page.locator('.tree-screen-title strong').all_inner_texts())
        assert await page.locator('#tree-counter').inner_text()=='3 de 3 telas selecionadas'
        # open tree -> selected element
        first=page.locator('.tree-screen-section').first
        await first.locator('.tree-node').filter(has=page.locator('.tree-prop',has_text='estrutura')).first.click()
        print('expanded tree children',await first.locator('.tree-nested:not([hidden]) .tree-node').count())
        await first.locator('.tree-node').filter(has=page.locator('.tree-prop',has_text='fragmentos')).first.click()
        assert 'estrutura' in await page.locator('#tree-detail-path').input_value()
        await page.screenshot(path=str(ART/'arvore_v3.png'),full_page=True)
        # export single
        async with page.expect_download() as dl:
            await first.get_by_role('button',name='↓ Exportar esta tela').click()
        filename=(await dl.value).suggested_filename
        fp=ART/filename;await (await dl.value).save_as(str(fp))
        single=json.loads(fp.read_text())
        assert single['schema']=='advogadoja-laboratorio-telas-v2-export'
        assert single['tipo']=='tela' and single['tela']['id']=='auth.sessao.entrar'
        assert all(x in single['tela'] for x in ['estrutura','estilos','acoes','interacoes','dados','estados'])
        print('SINGLE',filename,len(fp.read_bytes()))
        # select only 2 screens
        await page.locator('#tree-select-none').click()
        assert await page.locator('#tree-export-selected').is_disabled()
        await page.locator('.tree-screen-check').nth(0).check()
        await page.locator('.tree-screen-check').nth(2).check()
        async with page.expect_download() as dl:
            await page.locator('#tree-export-selected').click()
        f=ART/(await dl.value).suggested_filename;await (await dl.value).save_as(str(f))
        selected=json.loads(f.read_text())
        assert selected['tipo']=='colecao' and {s['id'] for s in selected['telas']}=={'auth.sessao.entrar','cliente.home_cliente'}
        print('SELECTED',f.name,len(f.read_bytes()))
        # export all even subset selected
        async with page.expect_download() as dl:
            await page.locator('#tree-export-all').click()
        f=ART/(await dl.value).suggested_filename;await (await dl.value).save_as(str(f))
        all_data=json.loads(f.read_text())
        assert len(all_data['telas'])==3
        print('ALL',f.name,len(f.read_bytes()))
        # search finds a deeply nested property
        await page.locator('#tree-search').fill('login-form')
        await page.wait_for_timeout(450)
        print('SEARCH',await page.locator('.tree-search-result').count())
        assert await page.locator('.tree-search-result').count()>0
        await page.locator('#tree-search').fill('')
        await page.wait_for_timeout(350)
        # import conflict: change screen name, preserving another
        single['tela']['nome']='Entrar importado!'
        changed=ART/'importar_modificado.json';changed.write_text(json.dumps(single,ensure_ascii=False))
        await page.locator('#tree-import-file').set_input_files(str(changed));await page.wait_for_timeout(150)
        assert await page.locator('#tree-import-overlay').is_visible()
        assert '1 ID(s) já existente(s)' in await page.locator('#tree-import-summary').inner_text()
        await page.locator('#tree-import-confirm').click()
        assert await page.locator('.tree-screen-title strong').first.inner_text()=='Entrar'
        print('CONFLICT SKIP PASSED')
        await page.locator('#tree-import-file').set_input_files(str(changed));await page.wait_for_timeout(120)
        await page.locator('#tree-import-policy').select_option('replace')
        await page.locator('#tree-import-confirm').click()
        assert await page.locator('.tree-screen-title strong').first.inner_text()=='Entrar importado!'
        assert await page.locator('.tree-screen-section').count()==3
        print('CONFLICT REPLACE PASSED')
        # new screen imports standalone
        single['tela']['id']='teste.nova_tela';single['tela']['nome']='Nova tela importada';single['tela']['ativa']=True
        single['tipo']='tela'
        new=ART/'importar_nova.json';new.write_text(json.dumps(single,ensure_ascii=False))
        await page.locator('#tree-import-file').set_input_files(str(new));await page.wait_for_timeout(120)
        await page.locator('#tree-import-confirm').click()
        assert await page.locator('.tree-screen-section').count()==4
        assert await page.locator('.tree-screen-title strong').last.inner_text()=='Nova tela importada'
        print('ADDED SCREEN PASSED')
        # full project no loss
        async with page.expect_download() as dl:
            await page.locator('#export-button').click()
        f=ART/(await dl.value).suggested_filename;await (await dl.value).save_as(str(f))
        d=json.loads(f.read_text());assert len(d['telas'])==4
        print('PROJECT',f.name,len(f.read_bytes()))
        # selected tree item to editor; navigation still works
        await page.locator('#tree-search').fill('')
        await page.locator('.tree-screen-section').first.locator('.tree-node').first.click()
        await page.locator('#tree-edit-block').click()
        assert await page.locator('#mode-edit').get_attribute('class')=='is-active'
        assert await page.locator('#json-section').input_value() in ['tela','estrutura']
        await page.locator('#mode-sim').click()
        frm=page.frame_locator('#preview-frame')
        await frm.locator('#login-form button[type="submit"]').click()
        await page.wait_for_timeout(420)
        assert await page.locator('#canvas-path').inner_text()=='advogado.home_advogado'
        print('NAVIGATION PASSED')
        # malformed import unchanged, no popup
        await page.locator('#mode-tree').click()
        invalid=ART/'invalid.json';invalid.write_text('{"schema":"invalid","telas":{}}')
        await page.locator('#tree-import-file').set_input_files(str(invalid))
        await page.wait_for_timeout(150)
        assert not await page.locator('#tree-import-overlay').is_visible()
        assert await page.locator('.tree-screen-section').count()==4
        assert not errors,errors
        assert not requests,requests
        print('PASS: no JS errors or external requests')
        await browser.close()
asyncio.run(main())
