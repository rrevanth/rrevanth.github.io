call jekyll build
MOVE _site E:\
call git checkout -B master
MD temp
MOVE E:\_site\* .\temp\