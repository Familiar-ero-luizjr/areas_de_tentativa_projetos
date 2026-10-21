"""Testes opcionais em navegador real. Requer pip install playwright e Chromium.
Usar: python ferramentas/testar_html.py
"""
from pathlib import Path
import asyncio
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
MODELS=['arvore-repositorio','catalogo-modulos','aplicacao-painel']

async def main():
    async with async_playwright() as p:
        browser=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
        for slug in MODELS:
            page=await browser.new_page(viewport={'width':1230,'height':800},accept_downloads=True)
            errors=[];requests=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('request',lambda r: requests.append(r.url) if r.url.startswith('http') else None)
            await page.set_content((ROOT/'exemplos'/slug/'saida'/f'{slug}.html').read_text(encoding='utf-8'),wait_until='load')
            assert await page.locator('.status').count()==1
            assert 'itens disponíveis' in await page.locator('#status').inner_text(),(slug,await page.locator('#status').inner_text(),errors)
            expected={'arvore-repositorio':20,'catalogo-modulos':6,'aplicacao-painel':4}[slug]
            assert str(expected) in await page.locator('#status').inner_text(),slug
            if slug=='arvore-repositorio':
                await page.get_by_role('button',name='Expandir advogadoja-demo').click()
                assert await page.get_by_role('button',name='web',exact=False).count()>0
                await page.get_by_role('button',name='Expandir web').click()
                assert await page.get_by_role('button',name='ui',exact=False).count()>0
            else:
                assert await page.locator('.card-btn').count()==expected,(slug,await page.locator('.card-btn').count())
            await page.locator('#searchInput').fill('autenticação' if slug=='arvore-repositorio' else 'simulad')
            await page.wait_for_timeout(350)
            n=await page.locator('#status').inner_text()
            assert 'resultado' in n,(slug,n,errors)
            await page.locator('#searchMode').select_option('name')
            await page.wait_for_timeout(350)
            assert 'resultado' in await page.locator('#status').inner_text()
            await page.locator('#clearSearch').click()
            await page.wait_for_timeout(60)
            assert 'disponíveis' in await page.locator('#status').inner_text()
            await page.locator('[data-select-id]').first.click()
            assert await page.locator('#detailsContent h2').count()==1
            async with page.expect_download() as download_info:
                await page.locator('#exportData').click()
            download=await download_info.value
            assert download.suggested_filename==f'{slug}.json',download.suggested_filename
            assert not errors,(slug,errors)
            assert not requests,(slug,requests)
            print(f'OK {slug}: renderização, busca, detalhes, exportação, offline e ausência de exceções JS')
            await page.close()
        await browser.close()

if __name__=='__main__':asyncio.run(main())
