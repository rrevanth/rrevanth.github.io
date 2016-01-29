---

---
// builds lunr
var index = lunr(function () {
  this.field('tags')
  this.ref('id')
});
{% assign count = 0 %}{% for post in site.posts %}
index.add({
  tags: {{ post.tags | jsonify}},
  id: {{count}}
});{% assign count = count | plus: 1 %}{% endfor %}
// builds reference data
var store = [{% for post in site.posts %}{
  "title": {{post.title | jsonify}},
  "link": {{ post.url | jsonify }},
  "date": {{ post.date | date: '%B %-d, %Y' | jsonify }},
  "category": {{ post.category | jsonify }},
  "tags": {{ post.tags | jsonify }},
  "excerpt": {{ post.content | strip_html | truncatewords: 20 | jsonify }}
}{% unless forloop.last %},{% endunless %}{% endfor %}]
// builds search
$.urlParam = function(name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
     return null;
  }
  else{
     return results[1] || 0;
  }
}

/**
 * Adds Param to URL
 * @param {String} url
 * @param {String} param
 * @param {String} value
 * @return {String} Modified URL 
 */
function addParam(url, param, value) {
    var a = document.createElement('a'), regex = /(?:\?|&amp;|&)+([^=]+)(?:=([^&]*))*/g;
   var match, str = []; a.href = url; param = encodeURIComponent(param);
   while (match = regex.exec(a.search))
       if (param != match[1]) str.push(match[1]+(match[2]?"="+match[2]:""));
   str.push(param+(value?"="+ encodeURIComponent(value):""));
   a.search = str.join("&");
   return a.href;
}

$.injectResults = function(name) {
  var resultdiv = $('#search-results');
  query = decodeURIComponent(name.replace(/\+/g," "));
  $('input#search').val(query);
  var result = index.search(query);
  var tagset = new Set();
  // Show results
  resultdiv.empty();
   // Add status
  resultdiv.prepend('<center><h2 style="background:#ad141e;border-radius: 20px;margin-bottom: 56px;color: white;" class="post_title">Found '+result.length+' result(s)</h2></center>');
  // Loop through, match, and add results
  for (var item in result) {
    var ref = result[item].ref;
    var searchitem = '<li style="padding-top: 1rem;" class="s-post-list"><a style="float:left;font-size:1.1rem" class="title" href="'+store[ref].link+'">'+store[ref].title+'</a><div style="float:right;display:inline-block;">';
    var tags = store[ref].tags;
    for (var tag in tags) {
      if(query.indexOf(tags[tag]) == -1 ) tagset.add(tags[tag]);
      searchitem += '<a class="tags" style="float:right" href="/tag/'+tags[tag]+'">'+tags[tag]+'</a>';
    };
    searchitem += '</div></li>';
    resultdiv.append(searchitem);
  }
  taglist = [...tagset];
  var tagitem = '';
  // tagitem += '<button class="search-tags" value="'+taglist[tag]+'">'+taglist[tag]+'</button>';
  for(tag in taglist) {
    tagitem += '<button style="margin:2px;" id="s-tag-button" onclick="tagClick('+'\''+taglist[tag]+'\''+')">'+taglist[tag]+'</button>';
  }
  $("#s-tags-div").html(tagitem);
  href = addParam(document.URL,'q',query);
  window.history.pushState('Revanth Revoori', "Tag search for"+query+" Revanth's Blog", href);
}
function tagClick(id) {
    var text = $('#search').val();
    if(text.indexOf('id') > -1) {
        text = text.replace('/'+id+'/g','');
    } else {
        text += ' '+id;
    }
    $.injectResults(text.trim());
}
$(document).ready(function() {

  $('.search-tags').on('click',function() {
      id = $(this).attr("value").trim();
      var text = $('#search').val();
      if(text.indexOf('id') > -1) {
          text = text.replace('/'+id+'/g','');
      } else {
          text += ' '+id;
      }
      $.injectResults(text.trim());
  });
  $('.s-tags-toggle').on('click',function() {
      $('#s-tags-div').toggle();
      if ($(".s-tags-toggle").text() == "Hide Tags") {
          $(".s-tags-toggle").text("Show Tags");
      }
      else {
          $(".s-tags-toggle").text("Hide Tags");
      }
  });
  if($.urlParam('q')) {
    // Get query
    var query = $.urlParam('q');
    // Search for it
    $.injectResults(query);
    }
  $('input#search').on('input', function () {
    // Get query
    var query = $(this).val();
    if (!this.value) {
      {% capture tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
      {% assign sortedtags = tags | split:',' | sort %}
      $('#s-tags-div').html('{% for tag in sortedtags %}<button style="margin:2px;" id="s-tag-button" class="search-tags" onclick="tagClick(\'{{tag}}\')" >{{ tag }}</button>{% endfor %}');
    }
    else {
      $.injectResults(query);
    }
  });
});