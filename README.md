#README

This contains source and webpage for my blog site http://rrevanth.github.io build using jekyll and hosted on github pages.

The source can be found in source branch whereas master branch contains the compiled website.

It also includes configuration for build Rakefile and configuration for building automatically with Travis CL.

To host your own blog with this theme :

- Clone this repo.
- Remove all posts in _posts directory.
- For generating website,
	use command `rake` inside the source repo.
	It will automatically build the code and push it to master branch of the repo.

- For auto deploying with Travis,check out the link http://rrevanth.github.io/blog/autodeploywithtravis
