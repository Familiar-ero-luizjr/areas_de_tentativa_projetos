$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Push-Location $root
try { dart format --set-exit-if-changed lib test; flutter analyze; flutter test }
finally { Pop-Location }
