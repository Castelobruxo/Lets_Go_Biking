var restop = ["pizza hut", "dairy queen", "olive garden", "red lobster", "eatin park", "mcdonalds", "wendys", "shawarma brothers"];
var drugop = ["CVS", "walgreens", "riteaid", "drug mart", "eatin park"]

var populateop = function(arr) {
    for(i=0;i<arr.length;i++) {
         newcol = $("<div>");
         newcol.addClass("col-md-3 col-sm-6 col-xs-12")
         newcard = $("<div>");
         newcard.addClass("card")

         newcardbody = $("<div>");
         newcardbody.addClass("card-body")
        
         newcardhead = $("<h5>");
         newcardhead.addClass("card-title")
         newcardhead.text(restop[i])
        
         newcardtext = $("<p>")
         newcardtext.addClass("card-text")
        
         newcardbody.append(newcardhead)
         newcardbody.append(newcardtext)
         newcard.append(newcardbody)
         newcol.append(newcard)
        $(".localoptions").append(newcol)
     }
     $(".localoptionbox").css("display", "block")
}

$(".gobtn").on("click", function() {
    // $(".localoptions").html("");
    // if($(".drop").val() == 1) {
    //     populateop(restop);
    // }
    // if($(".drop").val() == 2) {
    //     populateop(drugop);
    // }
    $(".localoptionbox").css("display", "block")
});

$(".clearbtn").on("click", function() {
    $(".localoptions").html("");
    $(".localoptionbox").css("display", "none")
});