@setlocal
@cd %~dp0\..
@mkdir build
cd build        || @exit /b 1 
cmake -G "Visual Studio 14 2015 Win64" .. || @exit /b 1
cmake --build . --config "Debug" || @exit /b 3
ctest -C "Debug" -VV .     || @exit /b 4
