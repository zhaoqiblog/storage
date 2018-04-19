rem 构建项目，VUE_INSTALL_PATH为文件夹路径
set VUE_INSTALL_PATH=D:\vue-templat

IF NOT EXIST %VUE_INSTALL_PATH% (
%~d0
cd %~dp0
md %VUE_INSTALL_PATH%
md %VUE_INSTALL_PATH%\build
md %VUE_INSTALL_PATH%\config
md %VUE_INSTALL_PATH%\src
md %VUE_INSTALL_PATH%\static
xcopy %~dp0build %VUE_INSTALL_PATH%\build /s /e
xcopy %~dp0config %VUE_INSTALL_PATH%\config /s /e
xcopy %~dp0src %VUE_INSTALL_PATH%\src /s /e
xcopy %~dp0static %VUE_INSTALL_PATH%\static /s /e
xcopy %~dp0package.json %VUE_INSTALL_PATH%
xcopy %~dp0.babelrc %VUE_INSTALL_PATH%
xcopy %~dp0.editorconfig %VUE_INSTALL_PATH%
xcopy %~dp0.gitignore %VUE_INSTALL_PATH%
xcopy %~dp0.postcssrc.js %VUE_INSTALL_PATH%
xcopy %~dp0CubeModule.json %VUE_INSTALL_PATH%
xcopy %~dp0index.html %VUE_INSTALL_PATH%
xcopy %~dp0README.md %VUE_INSTALL_PATH%
pause
)
IF EXIST %VUE_INSTALL_PATH% (
echo folder is exist!
pause
)