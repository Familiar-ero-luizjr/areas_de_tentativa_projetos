$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Push-Location $root
try { flutter pub get; flutter run -d chrome --dart-define-from-file=config/development.json }
finally { Pop-Location }
