---
published: false
---

## Automate Jekyll Blog to Github with Travis CI

Jekyll is awesome,so it github for hosting a static blog build in jekyll for free :smile: .

In this post,I will explain 
1. Deploying a jekyll blog to github with rake
2. Automate the build process with Travis CI

### Deploying with Rake

This post assumes that your jekyll blog git repo contains two branches
- source branch - contains the source files for blog.
- master branch - contains the compiled blog.

Make sure you are in source branch.Add a file named Rakefile to your root dir that contains the following code ..

Rakefile
{% highlight ruby linenos=table %}

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
    task :publish => [:generate] do
      Dir.mktmpdir do |tmp|
        system "mv _site/* #{tmp}"
        system "git checkout -B master"
        system "rm -rf *"
        system "mv #{tmp}/* ."
        message = "Site updated at #{Time.now.utc}"
        system "git add ."
        system "git rm .deploy_key.enc .travis.yml"
        system "git commit -am #{message.shellescape}"
        system "git push origin master --force"
        system "git checkout source"
        system "echo published to master"
      end
    end

task :default => :publish

{% endhighlight %} 

After adding this,you can build and deploy the updated source code to master just by running one command.Make sure you are in root dir of your git repo and run the following command :

> rake

That's it.So simple,right.Not so fast.We just don't wanna run this command every time we create to post.We need something much better.

### Enter Travis,the saviour

As you might know,Travis CI is used for testing and deploying automatically for git repositories.We are gonna use this feature to automatically build and deploy the site to master whenever we push any changes to source.

Adding Travis integration is simple,add .travis.yml file to source root dir.

