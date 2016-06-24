var fullCardContainer;
var cards = {};
var tags = [];
var cardTitle = document.querySelector('#new-card-title');
var cardNotes = document.querySelector('#new-card-notes');
var element = document.getElementsByClassName("content");
var cardTag = document.querySelector('#tags');
var chatMessage = document.querySelector('#chat-input');
var reset_title = document.getElementById('new-card-title');
var reset_body = document.getElementById('new-card-notes');
var reset_message = document.getElementById('chat-input');

function appendPreviewCard(response){
    var tag_items = '';
    for (j = 0; j < response.data.tags.length; j++) {
        tag_items += `<li>${response.data.tags[j]}</li>`;
    }
    var preview = `<div class="preview_cards" data-index="${response.data.length - 1}" id="${response.data._id}">
        <h3 class="card_title">${response.data.title}</h3>
        <div class="author">${response.data.author}</div>
        <ul class="preview_card_tags">
        ${tag_items}
        </ul>
        <div class="card_thumbnail">
        <img src="images/150x150.jpg" >
        </div>
        <p class="upload_date">YYYY-MM-DD</p>
        </div>`;
    $(element).append(preview);
};

$(function(){
    $.ajax({
        url: "http://localhost:3000/api",
        type: "GET",
        success: function(response){
            console.log(response.data);
            for (var k=0; k < response.data.length; k++){
                var object_id = response.data[k]._id;
                cards[object_id]= response.data[k]
            }
            console.log(cards);
            for (var i=0; i < response.data.length; i++){
                var tag_items = '';
                for (j=0; j < response.data[i].tags.length; j++) {
                    tag_items += `<li>${response.data[i].tags[j]}</li>`;
                }
                var preview = `<div class="preview_cards" id="${response.data[i]._id}" data-index="${i}">
            <h3 class="card_title">${response.data[i].title}</h3>
            <div class="author">${response.data[i].author}</div>
            <ul class="preview_card_tags">
            ${tag_items}
            </ul>
            <div class="card_thumbnail">
            <img src="images/150x150.jpg" >
            </div>
            <p class="upload_date">YYYY-MM-DD</p>
            </div>`;
                $(element).append(preview);
            }
        }
    });


    $('.delete-button > button').on('click', function(){
        $.ajax({
            url: `http://localhost:3000/api/${clicked_id}`,
            type: "DELETE",
            success: function(response){
                fullCardContainer.css("display", "none");
                delete cards[clicked_id];
                $(`#${clicked_id}`).remove();
                console.log(cards);
                clicked_id = null;
            }
        });
    });

    editCardContainer = $('.hide');
    fullCardContainer = $('.hidden');

    $('#add-card-button').on('click', function(){
        editCardContainer.css("display", "initial");
    });

    $(".close-action").on('click', function(){
        editCardContainer.css("display", "none");
        reset_title.value = null;
        reset_body.value = null;
        $(cardTag).empty();
        clicked_id = null;
        tags = [];
    });

    $(".full-close-action").on('click', function(){
        fullCardContainer.css("display", "none");
        clicked_id = null;
        tags = [];
    });

    $('#edit-existing').on('click', function(){
        fullCardContainer.css("display", "none");
        editCardContainer.css("display", "initial");
        tags = cards[clicked_id].tags;
        cardTitle.value = cards[clicked_id].title;
        cardNotes.value = cards[clicked_id].body;
        for (var t=0; t < cards[clicked_id].tags.length; t++) {
            var tag = $('<div/>').addClass('tag').html(cards[clicked_id].tags[t]);
            $(cardTag).append(tag);
        }
    });

    $(".save").on('click', function(){
        if (typeof clicked_id !== "undefined" && cards[clicked_id]){
            console.log(tags);
            $.ajax({
                url: `http://localhost:3000/api/${clicked_id}`,
                type: "PATCH",
                data: {
                    title: cardTitle.value,
                    tags: tags,
                    body: cardNotes.value,
                    author: 'Author'
                },
                traditional: true,
                success: function(response){
                    console.log(response)
                    var object_id = response.data._id;
                    cards[object_id] = response.data;
                    $(`#${object_id} > h3`).text(response.data.title);
                    $(`#${object_id} > ul`).empty();
                    if (cards[clicked_id].tags.length !== 0){
                        for (var t=0; t < cards[clicked_id].tags.length; t++) {
                            var tag = `<li>${cards[clicked_id].tags[t]}</li>`;
                            $(`#${object_id} > ul`).append(tag);
                        }};
                    console.log(cards);
                    reset_title.value = null;
                    reset_body.value = null;
                    $(cardTag).empty();
                    tags = [];
                    editCardContainer.css("display", "none");
                    clicked_id = null;
                },
                error: function(err){
                    console.log(err);
                }
            });
        } else {
            $.ajax({
                url: "http://localhost:3000/api",
                type: "POST",
                data: {
                    title: cardTitle.value,
                    tags: tags,
                    body: cardNotes.value,
                    author: 'Author'
                },
                traditional: true,
                success: function(response){
                    appendPreviewCard(response);
                    var object_id = response.data._id
                    cards[object_id]= response.data
                    console.log(cards)
                    reset_title.value = null;
                    reset_body.value = null;
                    $(cardTag).empty();
                    tags = [];
                    editCardContainer.css("display", "none");
                    clicked_id = null;
                }
            });}

    });

    $('#new-card-tags').on('keydown',function(e){
        if (e.keyCode === 13) {
            var tag = $('<div/>').addClass('tag').html(this.value);
            tags.push(this.value);
            $(cardTag).append(tag);
            this.value = null;
        }
    });

    $('#chat-input').on('keydown',function(e){
        if (e.keyCode === 13) {
            var a = `<div class="messagecontainer">Author - Date:</div>
        <div class="messagecontainer">${chatMessage.value}</div>
        <hr>`;
            $('#chat-messages').append(a);
            reset_message.value = null;
        }
    });


    $('#tags').on('click','.tag', function(e){
        $(e.target).remove();
        var b = tags.indexOf(e.target.textContent);
        if (b == 0){
            tags.pop();
            console.log(tags)
        } else{
            tags.splice(b, 1);
        }
    });

    $('.content').on('click','.preview_cards', function(){
        $('.full-tags').empty();
        clicked_id = $(this).attr('id');
        console.log(clicked_id);
        $('.full-title > h2').text(cards[clicked_id].title);
        $('.full-text-content > p').text(cards[clicked_id].body);
        $('.author-date').text(`${cards[clicked_id].author} on YYYY-MM-DD`);
        var tag_items = '';
        for (var i=0; i < cards[clicked_id].tags.length; i++){
            tag_items += `<li>${cards[clicked_id].tags[i]}</li>`;
        };
        $('.full-tags').append(tag_items);
        fullCardContainer.css("display", "initial");
    });

    $('#chat-send-button').on('click',function(){
        var a = `<div class="messagecontainer">Author - Date:</div>
        <div class="messagecontainer">${chatMessage.value}</div>
        <hr>`;
        $('#chat-messages').append(a);
        reset_message.value = null;
    });

    


});