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
                        if(list.name.match(/./)) {
                            $("<h3>")
                                .text(list.name)
                                .appendTo($lists);

                            var $cards = $("<ul>");

                            $cards.appendTo($lists);

                            $.each(cards, function (iy, card) {
                                if (card.idList === list.id) {
                                    var $cardInfo = $("<li>");

                                    if (card.due && list.name.match(/Events/)) {
                                      $("<span>")
                                        .text(card.due.substring(0, 10))
                                        .addClass("card-event-date")
                                        .appendTo($cardInfo);
                                    }

                                    $("<a>")
                                        .attr({href: card.shortUrl, target: "trello"})
                                        .text(card.name)
                                        .addClass("card-name")
                                        .appendTo($cardInfo);

                                    $.each(card.members, function(ix, member) {
                                        $("<span>")
                                            .text(member.fullName)
                                            .addClass("card-members")
                                            .appendTo($cardInfo);
                                    });

                                    $.each(card.labels, function(ix, label) {
                                        $("<span>")
                                            .text(label.color)
                                            .addClass("card-status "+label.color)
                                            .appendTo($cardInfo);
                                    });

                                    if (card.due && list.name.match(/Product/)) {
                                      $("<br>").appendTo($cardInfo);
                                      $("<span>")
                                        .text(card.due.substring(0, 10))
                                        .addClass("card-release-date")
                                        .appendTo($cardInfo);
                                    }

                                    if (card.desc) {
                                      var $descInfo = $("<ul>");

                                      $("<li>")
                                        .text(card.desc)
                                        .addClass("card-description")
                                        .appendTo($descInfo);

                                      $descInfo.appendTo($cardInfo);
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




