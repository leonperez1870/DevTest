$(document).ready(function() {

	var div = $('.items-grid'),
	json = $.ajax({
		url: 'posts.json',
		async: false,
		dataType: 'json',
		success: function (response) {
			console.log(response);
		}
	});


	// Parsers
	String.prototype.parseURL = function() {
		return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
			return url.link(url);
		});
	};

	String.prototype.parseUsername = function() {
		return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
			var username = u.replace("@","")
			return u.link("http://twitter.com/"+username);
		});
	};

	String.prototype.parseHashtag = function() {
		return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
			var tag = t.replace("#", "")
			return t.link("http://twitter.com/hashtag/"+tag+"?src=hash");
		});
	};

	String.prototype.parseInstagramHashtag = function() {
		return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
			var tag = t.replace("#", "")
			return t.link("http://instagram.com/tags/"+tag);
		});
	};
	
	// Load JSON
	json.done(function( data ) {
		$.each( data.items, function( i, item ) {

			var item_created = item.item_created,
				item_service_name = item.service_name;

			var item_id = $('<div>').attr("id", item.item_id)
				.attr("data-date", item_created)
				.attr("service-name", item_service_name)
				.addClass('column data-segment'),

				item_segments = $('<div>').attr("class", "ui segment"),
				item_name = item.item_name,
				item_account_name = item.account_name,
				item_data_text = item.item_data.text,
				item_data_link = item.item_data.link,
				item_data_link_text = item.item_data.link_text,
				item_image_url = item.item_data.image_url,
				item_tweet = item.item_data.tweet,
				item_slug = item.account_slug;

			div.append(item_id);
			item_id.append(item_segments);

			if (item_service_name == 'Twitter') {
				item_segments.append(
						$("<i class='fa fa-2x fa-twitter account-name' aria-hidden='true'>"),
						$("<p class='account-slug'>")
							.text(item_slug),
						$("<p class='tweet'>")
							.html(item_tweet.parseURL().parseUsername().parseHashtag())
					);
			} else if (item_service_name == 'Instagram') {
				var instagram_img = item.item_data.image.large,
					instagram_caption = item.item_data.caption;

				item_segments.append(
						$("<i class='fa fa-2x fa-instagram account-name' aria-hidden='true'>"),
						$("<img class='account-img'>")
							.attr("src", instagram_img),
						$("<p class='account-slug instagram'>")
							.text(item_slug),
						$("<p class='instagram-caption'>")
							.html(instagram_caption.parseInstagramHashtag())
					);
			} else {
				item_segments.append(
						$("<p class='account-name'>")
							.text(item_account_name),
						$("<img class='account-img'>")
							.attr("src", item_image_url),
						$("<p class='item-data-text'>")
			 				.text(item_data_text),
			 			$("<a class='item-data-link'>")
			 				.attr("href", item_data_link)
			 				.text(item_data_link_text)
					);
			}

			// Data Sorting
			$(".data-segment").sort(function (a,b) {
				return new Date($(a).attr("data-date")) > new Date($(b).attr("data-date"));
			}).each(function() {
				$(".items-grid").prepend(this);
			});

			// Filters
			$('select').change(function() {
				var filter = $(this).find("option:selected").val(),
					div_instagram = $('div[service-name=Instagram]'),
					div_twitter = $('div[service-name=Twitter]'),
					div_posts = $('div[service-name=Manual]');

				if (filter == "Twitter") {
					div_posts.hide();
					div_instagram.hide();
					div_twitter.show();
				} else if (filter == "Instagram") {
					div_posts.hide();
					div_twitter.hide();
					div_instagram.show();
				} else if (filter == "Manual") {
					div_posts.show();
					div_twitter.hide();
					div_instagram.hide();
				} else if (filter == "") {
					div_twitter.show();
					div_instagram.show();
					div_posts.show();
				}
			});
		});

		//Load More
		var loadThis = $('.ui.segment');

		loadThis.slice(0,9).fadeIn();
		
		$("#loadMore").on('click', function(e) {
			e.preventDefault();
			$('.ui.segment:hidden').slice(0,3).fadeIn();
		});
	});		
});