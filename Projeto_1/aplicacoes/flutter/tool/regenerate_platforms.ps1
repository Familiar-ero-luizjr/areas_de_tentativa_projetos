$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Push-Location $root
try {
  if (-not (Get-Command flutter -ErrorAction SilentlyContinue)) { throw "Flutter não encontrado no PATH." }
  flutter create . --project-name advogado_ja_plus --org br.com.advogadoja --platforms=android,ios,web
  flutter pub get
  flutter analyze
  flutter test
}
finally { Pop-Location }
