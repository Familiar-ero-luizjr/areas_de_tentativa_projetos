import 'dart:async';

import 'package:flutter/material.dart';

void main() => runApp(const AdvogadoJaApp());

/// Primeira jornada visual definida no Construtor V2.
///
/// Não há autenticação, integração ou persistência: o estado vive somente na
/// interface para permitir validar a sequência Splash → Boas-vindas → Entrar.
class AdvogadoJaApp extends StatelessWidget {
  const AdvogadoJaApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
        title: 'AdvogadoJá Plus',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          fontFamily: 'Segoe UI',
          colorScheme: ColorScheme.fromSeed(seedColor: _AppColors.primary),
          scaffoldBackgroundColor: _AppColors.page,
          useMaterial3: true,
        ),
        home: const InitialJourney(),
      );
}

enum _JourneyStage { splash, welcome, login, construction }

class InitialJourney extends StatefulWidget {
  const InitialJourney({super.key});

  @override
  State<InitialJourney> createState() => _InitialJourneyState();
}

class _InitialJourneyState extends State<InitialJourney> {
  _JourneyStage _stage = _JourneyStage.splash;
  Timer? _splashTimer;

  @override
  void initState() {
    super.initState();
    _splashTimer = Timer(const Duration(milliseconds: 1700), () {
      if (mounted) _goTo(_JourneyStage.welcome);
    });
  }

  @override
  void dispose() {
    _splashTimer?.cancel();
    super.dispose();
  }

  void _goTo(_JourneyStage stage) {
    _splashTimer?.cancel();
    setState(() => _stage = stage);
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        body: AnimatedSwitcher(
          duration: const Duration(milliseconds: 280),
          child: switch (_stage) {
            _JourneyStage.splash => _SplashScreen(
                key: const ValueKey('splash'),
                onContinue: () => _goTo(_JourneyStage.welcome),
              ),
            _JourneyStage.welcome => _WelcomeScreen(
                key: const ValueKey('welcome'),
                onContinue: () => _goTo(_JourneyStage.login),
              ),
            _JourneyStage.login => _LoginScreen(
                key: const ValueKey('login'),
                onEnter: () => _goTo(_JourneyStage.construction),
                onBack: () => _goTo(_JourneyStage.welcome),
              ),
            _JourneyStage.construction => _ConstructionScreen(
                key: const ValueKey('construction'),
                onBack: () => _goTo(_JourneyStage.login),
              ),
          },
        ),
      );
}

class _SplashScreen extends StatelessWidget {
  const _SplashScreen({super.key, required this.onContinue});

  final VoidCallback onContinue;

  @override
  Widget build(BuildContext context) => DecoratedBox(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(0, -.6),
            radius: 1.2,
            colors: [Color(0xFF284E7D), _AppColors.primary, Color(0xFF08172D)],
            stops: [0, .48, 1],
          ),
        ),
        child: Center(
          child: Semantics(
            button: true,
            label: 'Continuar para boas-vindas',
            child: InkWell(
              onTap: onContinue,
              borderRadius: BorderRadius.circular(24),
              child: Padding(
                padding: const EdgeInsets.all(28),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const _BrandMark(size: 76, radius: 24),
                    const SizedBox(height: 22),
                    const Text(
                      'AdvogadoJá Plus',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 46,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -1.84,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      );
}

class _WelcomeScreen extends StatelessWidget {
  const _WelcomeScreen({super.key, required this.onContinue});

  final VoidCallback onContinue;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
        builder: (context, constraints) {
          final desktop =
              constraints.maxWidth >= 700 && constraints.maxHeight >= 650;
          final image = Image.asset(
            'assets/welcome/welcome_professionals.png',
            fit: BoxFit.cover,
            alignment: Alignment.topCenter,
            width: double.infinity,
            height: double.infinity,
          );
          final copy = _WelcomeCopy(
            onContinue: onContinue,
            desktop: desktop,
          );

          if (!desktop) {
            return ColoredBox(
              color: Colors.white,
              child: Column(
                children: [
                  Expanded(flex: 38, child: image),
                  Expanded(flex: 62, child: copy),
                ],
              ),
            );
          }

          return ColoredBox(
            color: const Color(0xFFE9EFF6),
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(34),
                child: Container(
                  width: 1080,
                  height: (constraints.maxHeight - 68).clamp(0, 680).toDouble(),
                  clipBehavior: Clip.antiAlias,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border.all(color: _AppColors.line),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x2410233F),
                        blurRadius: 36,
                        offset: Offset(0, 12),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Expanded(flex: 108, child: image),
                      Expanded(flex: 92, child: copy),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      );
}

class _WelcomeCopy extends StatelessWidget {
  const _WelcomeCopy({required this.onContinue, required this.desktop});

  final VoidCallback onContinue;
  final bool desktop;

  @override
  Widget build(BuildContext context) => Padding(
        padding: EdgeInsets.fromLTRB(
          desktop ? 76 : 24,
          desktop ? 76 : 30,
          desktop ? 76 : 24,
          desktop ? 76 : 26,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'ADVOGADOJÁ PLUS',
              style: Theme.of(context).textTheme.labelLarge?.copyWith(
                    color: _AppColors.gold,
                    fontSize: 12,
                    letterSpacing: 1.08,
                    fontWeight: FontWeight.w800,
                  ),
            ),
            const SizedBox(height: 10),
            Text(
              'Olá, bem-vindo ao AdvogadoJá Plus',
              style: Theme.of(context).textTheme.displaySmall?.copyWith(
                    color: _AppColors.primary,
                    fontSize: 46,
                    fontWeight: FontWeight.w800,
                    height: 1.08,
                    letterSpacing: -1.61,
                  ),
            ),
            const SizedBox(height: 15),
            Text(
              'Conectamos pessoas e profissionais da advocacia de forma simples.',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: _AppColors.muted,
                    height: 1.6,
                  ),
            ),
            const Spacer(),
            _PrimaryButton(label: 'Continuar', onPressed: onContinue),
          ],
        ),
      );
}

class _LoginScreen extends StatelessWidget {
  const _LoginScreen({super.key, required this.onEnter, required this.onBack});

  final VoidCallback onEnter;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) => ColoredBox(
        color: _AppColors.page,
        child: SafeArea(
          child: Column(
            children: [
              const _TopBar(),
              Expanded(
                child: Center(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.fromLTRB(20, 54, 20, 48),
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 520),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          const _BrandMark(size: 64, radius: 21),
                          const SizedBox(height: 16),
                          Text(
                            'Entre na sua conta',
                            style: Theme.of(context)
                                .textTheme
                                .headlineMedium
                                ?.copyWith(
                                  color: _AppColors.primary,
                                  fontSize: 27,
                                  fontWeight: FontWeight.w800,
                                ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Acesse sua jornada na plataforma.',
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith(
                                  color: _AppColors.muted,
                                ),
                          ),
                          const SizedBox(height: 24),
                          _LoginCard(onEnter: onEnter),
                          const SizedBox(height: 12),
                          TextButton.icon(
                            onPressed: onBack,
                            icon: const Icon(Icons.arrow_back, size: 16),
                            label: const Text('Voltar para boas-vindas'),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
}

class _TopBar extends StatelessWidget {
  const _TopBar();

  @override
  Widget build(BuildContext context) => Container(
        width: double.infinity,
        height: 64,
        padding: const EdgeInsets.symmetric(horizontal: 18),
        color: _AppColors.primary,
        child: Row(
          children: [
            Image.asset(
              'assets/brand/brand_symbol.png',
              width: 26,
              height: 26,
              color: Colors.white,
            ),
            const SizedBox(width: 10),
            const Text(
              'AdvogadoJá Plus',
              style:
                  TextStyle(color: Colors.white, fontWeight: FontWeight.w800),
            ),
          ],
        ),
      );
}

class _LoginCard extends StatelessWidget {
  const _LoginCard({required this.onEnter});

  final VoidCallback onEnter;

  @override
  Widget build(BuildContext context) => Card(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: _AppColors.line),
        ),
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            children: [
              const _LoginField(
                  label: 'E-mail', keyboardType: TextInputType.emailAddress),
              const SizedBox(height: 14),
              const _LoginField(label: 'Senha', obscureText: true),
              Align(
                alignment: Alignment.centerLeft,
                child: TextButton(
                  onPressed: onEnter,
                  child: const Text('Esqueci minha senha'),
                ),
              ),
              _PrimaryButton(label: 'Entrar', onPressed: onEnter),
              const _LoginDivider(),
              _SecondaryButton(
                  label: 'Continuar com Google', onPressed: onEnter),
              const SizedBox(height: 9),
              _SecondaryButton(
                  label: 'Continuar com Apple', onPressed: onEnter),
              const SizedBox(height: 20),
              Wrap(
                alignment: WrapAlignment.center,
                children: [
                  const Text(
                    'Ainda não tem conta?',
                    style: TextStyle(color: _AppColors.muted, fontSize: 13),
                  ),
                  TextButton(
                      onPressed: onEnter, child: const Text('Criar uma conta')),
                ],
              ),
            ],
          ),
        ),
      );
}

class _LoginField extends StatelessWidget {
  const _LoginField(
      {required this.label, this.obscureText = false, this.keyboardType});

  final String label;
  final bool obscureText;
  final TextInputType? keyboardType;

  @override
  Widget build(BuildContext context) => TextField(
        keyboardType: keyboardType,
        obscureText: obscureText,
        decoration: InputDecoration(
          labelText: label,
          floatingLabelStyle: const TextStyle(
            color: _AppColors.primary,
            fontWeight: FontWeight.w800,
            fontSize: 10,
          ),
          border: const OutlineInputBorder(
              borderRadius: BorderRadius.all(Radius.circular(12))),
        ),
      );
}

class _LoginDivider extends StatelessWidget {
  const _LoginDivider();

  @override
  Widget build(BuildContext context) => const Padding(
        padding: EdgeInsets.symmetric(vertical: 20),
        child: Row(
          children: [
            Expanded(child: Divider(color: _AppColors.line)),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 10),
              child: Text('ou',
                  style: TextStyle(color: _AppColors.muted, fontSize: 12)),
            ),
            Expanded(child: Divider(color: _AppColors.line)),
          ],
        ),
      );
}

class _PrimaryButton extends StatelessWidget {
  const _PrimaryButton({required this.label, required this.onPressed});

  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) => SizedBox(
        width: double.infinity,
        height: 54,
        child: FilledButton(
          onPressed: onPressed,
          style: FilledButton.styleFrom(
            backgroundColor: _AppColors.primary,
            foregroundColor: Colors.white,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(13)),
          ),
          child: Text(label,
              style:
                  const TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
        ),
      );
}

class _SecondaryButton extends StatelessWidget {
  const _SecondaryButton({required this.label, required this.onPressed});

  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) => SizedBox(
        width: double.infinity,
        height: 50,
        child: OutlinedButton(
          onPressed: onPressed,
          style: OutlinedButton.styleFrom(
            foregroundColor: _AppColors.primary,
            side: const BorderSide(color: _AppColors.line),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          child:
              Text(label, style: const TextStyle(fontWeight: FontWeight.w800)),
        ),
      );
}

class _ConstructionScreen extends StatelessWidget {
  const _ConstructionScreen({super.key, required this.onBack});

  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) => Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 540),
          child: Card(
            margin: const EdgeInsets.all(28),
            elevation: 0,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
                side: const BorderSide(color: Color(0xFFDCE4F0))),
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.construction_rounded,
                      color: _AppColors.primary, size: 42),
                  const SizedBox(height: 20),
                  Text('Em construção',
                      style: Theme.of(context)
                          .textTheme
                          .headlineMedium
                          ?.copyWith(
                              color: _AppColors.primary,
                              fontWeight: FontWeight.w800)),
                  const SizedBox(height: 12),
                  const Text(
                      'A tela de entrada já está no fluxo visual. A autenticação e os próximos destinos serão definidos antes de serem implementados.'),
                  const SizedBox(height: 28),
                  OutlinedButton.icon(
                      onPressed: onBack,
                      icon: const Icon(Icons.arrow_back),
                      label: const Text('Voltar para entrar')),
                ],
              ),
            ),
          ),
        ),
      );
}

class _BrandMark extends StatelessWidget {
  const _BrandMark({this.size = 76, this.radius = 24});

  final double size;
  final double radius;

  @override
  Widget build(BuildContext context) => Container(
        width: size,
        height: size,
        padding: EdgeInsets.all(size * .23),
        decoration: BoxDecoration(
          color: _AppColors.primary,
          borderRadius: BorderRadius.circular(radius),
          boxShadow: const [
            BoxShadow(
                color: Color(0x2E000000),
                blurRadius: 22,
                offset: Offset(0, 10)),
          ],
        ),
        child: Image.asset('assets/brand/brand_symbol.png'),
      );
}

abstract final class _AppColors {
  static const primary = Color(0xFF10233F);
  static const gold = Color(0xFFB88932);
  static const page = Color(0xFFEEF2F6);
  static const line = Color(0xFFDBE3EE);
  static const muted = Color(0xFF526276);
}
