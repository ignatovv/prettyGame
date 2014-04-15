
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { 
		title: 'SPACECRAFT',
		development: ('production' != process.env.NODE_ENV)
	});
};
