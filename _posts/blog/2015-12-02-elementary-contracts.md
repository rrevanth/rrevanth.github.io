---
categories: blog
author: Revanth Revoori
layout: blogpost
published: true
date: "2015-12-02 01:41 +0530"
tags: 
  - blog
  - elementary
  - ubuntu
  - contract
excerpt_separator: "<!--more-->"
title: Elementary Contracts
---




This post contains exhaustive contracts that will be useful for elementary OS.
You can use this on ubuntu also,but needs to change the exec command to open appropriate applications.

<!--more-->

### Open terminal in current directory

{% highlight bash linenos=table %}

[Contractor Entry]
Name=Summon ShellGod Here
Icon=terminal
Description=Open in terminal
MimeType=inode;application/x-sh;application/x-executable;
Exec=pantheon-terminal -w %U
Gettext-Domain=pantheon-terminal

{% endhighlight %}

### Open folder as Root

{% highlight bash linenos=table %}

[Contractor Entry]
Name=Summon Root on Folder
Icon=pantheon-files
Description=Open current folder as root privilege
MimeType=inode;
Exec=gksudo pantheon-files %U
Gettext-Domain=pantheon-files

{% endhighlight %}

### Open file as Root

{% highlight bash linenos=table %}

[Contractor Entry]
Name=Summon Root on File
Icon=scratch-text-editor
Description=open file as root with subl
MimeType=text
Exec=gksudo subl %U
Gettext-Domain=subl

{% endhighlight %}

### Media Info - Video


{% highlight bash linenos=table %}

[Contractor Entry]
Name=Media info
Icon=video
Description=media info
MimeType=video
Exec=gnome-terminal --window-with-profile=new1 -e "mediainfo -i %f"
Gettext-Domain=pantheon-files 


{% endhighlight %}

### Media Info - Audio


{% highlight bash linenos=table %}

[Contractor Entry]
Name=Media info
Icon=video
Description=media info
MimeType=audio
Exec=gnome-terminal --window-with-profile=new1 -e "mediainfo -i %f"
Gettext-Domain=pantheon-files  

{% endhighlight %}

### Extract Ogg from Webm

install parallel prior to this 

{% highlight bash linenos=table %}

[Contractor Entry]
Name=Extract audio
Icon=/usr/share/icons/hicolor/128x128/apps/multimedia-audio-player.svg
Description=Extract audio
MimeType=video/webm
Exec=pantheon-terminal -e "parallel avconv -i '{}' -map 0:1 -c:a copy '{}.ogg' ::: %F"
Gettext-Domain=pantheon-files

{% endhighlight %}
