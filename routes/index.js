var easymongo = require('easymongo');
var mongo = new easymongo({db: 'prettypaste'});
var short = require('short');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Pastetic' });
};


/*
 * POST paste content.
 */

exports.paste = function(req, res){
    var paste_id;
    var url = req.body.pasteContent;
    var options = {length: 7};
    //var short_url = crc32(req.body.pasteContent);
    
    short.connect("mongodb://localhost/short");

    short.generate(url, options, function (error, shortURL) {
        if (error) {
          console.error(error);
        } else {
          
          //var tinyUrl = [domain, ":", port, "/", shortURL.hash].join("");
          //console.log(["URL is ", shortURL.URL, " ", tinyUrl].join(""));
          //res.end(tinyUrl);
            var short_url = shortURL.hash;
            mongo.save('pastes', { paste: req.body.pasteContent, short_url: short_url }, function(results) {
                paste_id = results._id;
                res.redirect('/paste/' + short_url);
            });

        }
    });

 };


 exports.getPaste = function(req, res){
 	var paste_id = req.params.id;

	mongo.find('pastes', {short_url: paste_id.toString()}, function(result){

		if (result.length > 0) {
			the_paste = result[0].paste;
		} else {
			the_paste = "Not Found";
		}

		res.render('paste', { title: 'PrettyPaste', paste: the_paste});
	});
 };


