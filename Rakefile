  require 'rubygems'
    require 'rake'
    require 'rdoc'
    require 'date'
    require 'yaml'
    require 'tmpdir'
    require 'jekyll'

    desc "Generate blog files"
    task :generate do
      Jekyll::Site.new(Jekyll.configuration({
        "source"      => ".",
        "destination" => "_site"
      })).process
    end


    desc "Generate and publish blog to master"
    task :publish_master => [:generate] do
      Dir.mktmpdir do |tmp|
        system "mv _site/* #{tmp}"
        system "git checkout -B master"
        system "rm -rf *"
        system "mv #{tmp}/* ."
        message = "Site updated at #{Time.now.utc}"
        system "git add ."
        system "git commit -am #{message.shellescape}"
        system "git push origin master --force"
        system "git checkout source"
        system "echo published to master"
      end
    end

    task :publish_ghpages => [:generate] do
      Dir.mktmpdir do |tmp|
        system "mv _site/* #{tmp}"
        system "git checkout -B gh-pages"
        system "rm -rf *"
        system "mv #{tmp}/* ."
        message = "Site updated at #{Time.now.utc}"
        system "git add ."
        system "git commit -am #{message.shellescape}"
        system "git push origin gh-pages --force"
        system "git checkout source"
        system "echo published to gh-pages"
      end
    end

task :default => [:publish_master, :publish_ghpages] do
    system "Published to GH-Pages! 凸(+_+}凸 "
end