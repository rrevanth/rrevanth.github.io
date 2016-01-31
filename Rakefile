require 'rubygems'
require 'rake'
require 'rdoc'
require 'date'
require 'yaml'
require 'tmpdir'
require 'jekyll'
require 'reduce'
require 'serve'

desc "Delete _site"
task :delete do
  puts "\## Deleting _site/"
  status = system("rm -r _site")
  puts status ? "Success" : "Failed"
end

desc "Generate _site"
task :generate do
  Jekyll::Site.new(Jekyll.configuration({
    "source"      => ".",
    "destination" => "_site"
  })).process
end

desc "Preview site"
task :preview  do
  puts "\n## Opening _site/ on 4000"
  status = system("serve _site 4000")
  puts status ? "Success" : "Failed"
end

desc "Minify site"
task :minify do
  puts "\n## Compressing static assets"
  original = 0.0
  compressed = 0
  Dir.glob("_site/**/*.*") do |file|
    case File.extname(file)
      when ".css", ".gif", ".html", ".jpg", ".jpeg", ".js", ".png", ".xml"
        puts "Processing: #{file}"
        original += File.size(file).to_f
        min = Reduce.reduce(file)
        File.open(file, "w") do |f|
          f.write(min)
        end
        compressed += File.size(file)
      else
        puts "Skipping: #{file}"
      end
  end
  puts "Total compression %0.2f\%" % (((original-compressed)/original)*100)
end

desc "Build _site in given environment.Eg : rake build[arg] ## arg : 'dev' | 'prod' | default: 'pro'"
task :build, :env do |t, args|
    env = args[:env] || 'pro'
    case env
    when 'dev'
        puts "\n## Building _site in dev mode"
        Rake::Task["delete"].invoke
        Rake::Task["generate"].invoke
    else
        puts "\n## Building _site in pro mode"
        Rake::Task["delete"].invoke
        Rake::Task["generate"].invoke
        Rake::Task["minify"].invoke
    end
end

desc "Run site in given environment.Eg : rake build[arg] ## arg : 'dev' | 'prod' | default: 'pro'"
task :run, :env do |t, args|
    env = args[:env] || 'pro'
    case env
    when 'dev'
        puts "\n## Running _site in dev mode"
        Rake::Task["delete"].invoke
        Rake::Task["generate"].invoke
        Rake::Task["preview"].invoke
    else
        puts "\n## Running _site in pro mode"
        Rake::Task["delete"].invoke
        Rake::Task["generate"].invoke
        Rake::Task["minify"].invoke
        Rake::Task["preview"].invoke
    end
end

desc "Committing  source branch"
task :commit, :message do |t, args|
  puts "\n## Staging modified files"
  status = system("git add -A")
  puts status ? "Success" : "Failed"
  puts "\n## Committing a site build at #{Time.now.utc}"
  message = args[:message] || "Build site at #{Time.now.utc}"
  status = system("git commit -m \"#{message}\"")
  puts status ? "Success" : "Failed"
  puts "\n## Pushing commits to remote"
  status = system("git push origin source")
  puts status ? "Success" : "Failed"
end

desc "Deploy site to master branch"
task :deploy => [:build] do
  puts "\n## Deleting master branch"
  status = system("git branch -D master")
  puts status ? "Success" : "Failed"
  puts "\n## Creating new master branch and switching to it"
  status = system("git checkout -b master")
  puts status ? "Success" : "Failed"
  puts "\n## Forcing the _site subdirectory to be project root"
  status = system("git filter-branch --subdirectory-filter _site/ -f")
  puts status ? "Success" : "Failed"
  puts "\n## Switching back to source branch"
  status = system("git checkout source")
  puts status ? "Success" : "Failed"
  puts "\n## Pushing all branches to origin"
  status = system("git push --all origin")
  puts status ? "Success" : "Failed"
end

desc "Generate and publish blog to master"
task :publish => [:build] do
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

task :default => :deploy