$(function() {
    var onAuthorize = function() {
        updateLoggedIn();
        $("#output").empty();

        Trello.members.get("me", function(member){
            $("#fullName").text(member.fullName);

            var $lists = $("<div>")
                .text("Reticulating splines...")
                .appendTo("#output");

            Trello.get("boards/" + boardId + "/lists", function(lists) {
                Trello.get("boards/" + boardId + "/cards?members=true", function(cards) {
                    console.log(cards);
                    $lists.empty();

                    $.each(lists, function(ix, list) {
                        // use this to filter lists, if you're into that.
                        if(! list.name.match(/!/)) {
                            $("<h3>")
                                .text(list.name)
                                .appendTo($lists);

                            var $cards = $("<div>").addClass("trello-cards");
                            //var $cards = $("<ul>");

                            $cards.appendTo($lists);

                            $.each(cards, function (iy, card) {
                                if (card.idList === list.id) {
                                    var $cardInfo = $("<div>").addClass("trello-card");

                                    $("<a>")
                                        .attr({href: card.shortUrl, target: "trello"})
                                        .text(card.name)
                                        .addClass("card-name")
                                        .appendTo($cardInfo);

                                    var $metadata = new Array();

                                    if (card.due) {
                                      $metadata.push(
                                        $("<span>")
                                         .text(card.due.substring(0, 10))
                                         .addClass("card-due")
                                         .prop('outerHTML')
                                      );
                                    }

                                    var $memberList = $("<span>").addClass("card-members");
                                    var $memberArray = new Array();
                                    $.each(card.members, function(ix, member) {
                                       $memberArray.push(        
                                         $("<span>")
                                            .text(member.fullName)
                                            .addClass("card-member")
                                            .prop('outerHTML')
                                      );
                                    });
                                    if ($memberArray.length > 0) {
                                      $metadata.push(
                                        $memberList.html($memberArray.join(", ")).prop('outerHTML')
                                      );
                                    }

                                    var $labelList = $("<span>").addClass("card-labels");
                                    var $labelArray = new Array();
                                    $.each(card.labels, function(ix, label) {
                                       $labelArray.push(        
                                         $("<span>")
                                          .text(label.color)
                                          .attr("title", label.name)
                                          .addClass("card-label " + label.color)
                                          .prop('outerHTML')
                                      );
                                    });
                                    if ($labelArray.length > 0) {
                                      $metadata.push(
                                        $labelList.html($labelArray.join(", ")).prop('outerHTML')
                                      );
                                    }

                                    $('<br>').appendTo($cardInfo)
                                    $('<span>')
                                      .addClass('metadata gray')
                                      .html(" " + $metadata.join(" - "))
                                      .appendTo($cardInfo)
                                    ;

                                    if (card.desc) {
                                      $('<br>').appendTo($cardInfo)
                                      $("<span>")
                                        .html(markdownConverter.makeHtml(card.desc))
                                        .addClass("card-description")
                                        .appendTo($cardInfo);

                                    }

                                    $cardInfo.appendTo($cards);
                                }
                            });
                        }
                    });
                });
            });
        });
    };

    var updateLoggedIn = function() {
        var isLoggedIn = Trello.authorized();
        $("#loggedout").toggle(!isLoggedIn);
        $("#loggedin").toggle(isLoggedIn);
    };

    var logout = function() {
        Trello.deauthorize();
        updateLoggedIn();
    };

    Trello.authorize({
        interactive: false,
        success: onAuthorize
    });

    $("#connectLink")
        .click(function(){
            Trello.authorize({
                type: "popup",
                success: onAuthorize
            })
        });

    $("#disconnect").click(logout);
});




