@echo off
echo Starting HTTP server on port 8000...
echo.
echo Please open your browser and navigate to:
echo http://localhost:8000/labor-cost-allocation.html
echo.
cd /d "%~dp0"
python -m http.server 8000
if errorlevel 1 (
    echo Python not found, trying with PowerShell...
    powershell -Command "$listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8000/'); $listener.Start(); Write-Host 'Server running at http://localhost:8000/'; while($listener.IsListening) { $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $path = $request.Url.LocalPath; if($path -eq '/') { $path = '/labor-cost-allocation.html' }; $filePath = Join-Path $PWD.Path $path.TrimStart('/'); if(Test-Path $filePath) { $content = [System.IO.File]::ReadAllBytes($filePath); $response.ContentLength64 = $content.Length; $response.OutputStream.Write($content, 0, $content.Length); $ext = [System.IO.Path]::GetExtension($filePath); $response.ContentType = switch($ext) { '.html' { 'text/html; charset=utf-8' }; '.css' { 'text/css; charset=utf-8' }; '.js' { 'application/javascript; charset=utf-8' }; '.png' { 'image/png' }; '.jpg' { 'image/jpeg' }; '.svg' { 'image/svg+xml' }; default { 'application/octet-stream' } } } else { $response.StatusCode = 404; $errorContent = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found'); $response.ContentLength64 = $errorContent.Length; $response.OutputStream.Write($errorContent, 0, $errorContent.Length); }; $response.OutputStream.Close(); }"
)
