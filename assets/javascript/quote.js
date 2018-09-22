var url = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?";

$.ajax({
    url: url,
    dataType: 'json',
    success:function(data){
      $(".quote").text('"' + data.quoteText + '"');
      $(".author").text('-' + data.quoteAuthor);
    }
});