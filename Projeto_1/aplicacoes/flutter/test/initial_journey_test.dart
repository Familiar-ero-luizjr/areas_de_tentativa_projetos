import 'package:advogado_ja_plus/main.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('percorre a primeira jornada sem autenticar', (tester) async {
    await tester.pumpWidget(const AdvogadoJaApp());

    await tester.pump(const Duration(milliseconds: 1800));
    await tester.pumpAndSettle();
    expect(find.text('Olá, bem-vindo ao AdvogadoJá Plus'), findsOneWidget);

    await tester.tap(find.text('Continuar'));
    await tester.pumpAndSettle();
    expect(find.text('Entre na sua conta'), findsOneWidget);

    await tester.tap(find.text('Entrar'));
    await tester.pumpAndSettle();
    expect(find.text('Em construção'), findsOneWidget);
  });
}
