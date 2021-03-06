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
  puts "\n## Opening site on 4000"
  pids = [
      spawn("serve _site 4000"),
      spawn("google-chrome --incognito --url http://localhost:4000")
    ]
  trap "INT" do
    Process.kill "INT", *pids
    exit 1
  end

  loop do
    sleep 1
  end
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
  puts "\## Moving main css to _include"
  status = system("rm _includes/main.css && cp _site/css/main.css _includes/")
  puts status ? "Success" : "Failed"
end

desc "Gzipping assets"
task :compress do
  # puts "\## Gzipping css assets"
  # status = system("gzip -9 _site/assets/css/*")
  # puts status ? "Success" : "Failed"
  puts "\## Gzipping js assets"
  status = system("gzip -9 _site/assets/js/*")
  puts status ? "Success" : "Failed"
  # puts "\## Moving css assets from gz to css"
  # status = system("find _site/assets/css -name '*.css.gz' -exec rename 's/.css.gz$/.css/' {} \\;")
  # puts status ? "Success" : "Failed"
  puts "\## Moving js assets from gz to js"
  status = system("find _site/assets/js -name '*.js.gz' -exec rename 's/.js.gz$/.js/' {} \\;")
  puts status ? "Success" : "Failed"
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
        puts "\n## Running _site in dev mode,wait for build to complete and reload the tab"
        Rake::Task["delete"].invoke
        puts "\n## Serving site on 4000"
        pids = [
            spawn("jekyll serve --incremental -w"),
            spawn("google-chrome --incognito --url http://localhost:4000")
          ]
        trap "INT" do
          Process.kill "INT", *pids
          exit 1
        end

        loop do
          sleep 1
        end
    else
        puts "\n## Running _site in pro mode.Does not reload on changes"
        Rake::Task["delete"].invoke
        Rake::Task["generate"].invoke
        Rake::Task["minify"].invoke
        Rake::Task["generate"].invoke
        Rake::Task["minify"].invoke  # Needed for loading moved css file again,otherwise css changes won't reflect
        Rake::Task["preview"].invoke
    end
end

desc "Pushing changes to source branch"
task :push, :message do |t, args|
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

desc "Generate and publish blog to master"
task :publish => [:build] do
  Dir.mktmpdir do |tmp|
    puts "\n## Moving site to temp folder"
    status = system "mv _site/* #{tmp}"
    puts status ? "Success" : "Failed"
    puts "\n## Checkout to master branch"
    status = system "git checkout -B master"
    puts status ? "Success" : "Failed"
    puts "\n## Deleting content in master"
    status = system "rm -rf *"
    puts status ? "Success" : "Failed"
    puts "\n## Moving site to root folder"
    status = system "mv #{tmp}/* ."
    puts status ? "Success" : "Failed"
    status = system "echo \"revanthrevoori.com\" > CNAME"
    puts status ? "Success" : "Failed"
    puts "\n## Adding files to be committed"
    message = "Site updated at #{Time.now.utc}"
    status = system "git add ."
    puts status ? "Success" : "Failed"
    puts "\n## Removing travis deploy keys"
    status = system "git rm .deploy_key.enc .travis.yml"
    puts status ? "Success" : "Failed"
    puts "\n## Commiting files of site"
    status = system "git commit -am #{message.shellescape}"
    puts status ? "Success" : "Failed"
    puts "\n## Pushing branch to master"
    status = system "git push origin master --force"
    puts status ? "Success" : "Failed"
    puts "\n## Switching back to source branch"
    status = system "git checkout source"
    puts status ? "Success" : "Failed"
    puts "\n## Published to master"
  end
end

task :default => :publish