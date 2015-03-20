CALL jekyll build

MOVE _site E:\
MD temp
SET src_folder=E:\_site
SET tar_folder=.\temp

for /f %%a IN ('dir "%src_folder%" /b') do move %src_folder%\%%a %tar_folder%

pause