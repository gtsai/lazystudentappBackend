var cards = {};
var tags = [];
var socket = io.connect("http://localhost:8080");

function appendMessages(msg){
    console.log(msg);
    var current = moment(msg.createdAt).format("MMMM Do YYYY, h:mm:ss a");
    var a = `<li>
        <div class="messageauthor">${msg.author.name} at ${current}</div>
        <div class="messagebody">${msg.message}</div>
        <hr>
        </li>`;
    $('#chat-messages').append(a);
};

function appendPreviewCard(response){
    var tag_items = '';
    for (j = 0; j < response.data.tags.length; j++) {
        tag_items += `<li>${response.data.tags[j]}</li>`;
    }
    var preview = `<div class="preview_cards" data-index="${response.data.length - 1}" id="${response.data._id}">
        <h3 class="card_title">${response.data.title}</h3>
        <div class="author">By: ${response.data.author.name}</div>
        <ul class="preview_card_tags">
        ${tag_items}
        </ul>
        <div class="card_thumbnail">
        <img src="../images/${response.data.images.substring(12)}" >
        </div>
        <p class="upload_date">${response.data.createdAt.substring(0,10)}</p>
        </div>`;
    $("#preview-cards-container").append(preview);
};

$(function(){
    $.get("http://localhost:3000/api/messages", function(messages){
        console.log(messages.data);
        for (i=0; i < messages.data.length; i++) {
            appendMessages(messages.data[i]);
        }
        console.log("helloooo!")
    });

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
            <div class="author">By: ${response.data[i].author.name}</div>
            <ul class="preview_card_tags">
            ${tag_items}
            </ul>
            <div class="card_thumbnail">
            <img src="../images/${response.data[i].images.substring(12)}" >
            </div>
            <p class="upload_date">${response.data[i].createdAt.substring(0,10)}</p>
            </div>`;
                $("#preview-cards-container").append(preview);
            }
        }
    });
    
    $('.delete-button > button').on('click', function(){
        $.ajax({
            url: `http://localhost:3000/api/${clicked_id}`,
            type: "DELETE",
            success: function(response){
                $('.hidden').css("display", "none");
                delete cards[clicked_id];
                $(`#${clicked_id}`).remove();
                console.log(cards);
                clicked_id = null;
            }
        });
    });

    $('#add-card-button').on('click', function(){
        $('.hide').css("display", "initial");
    });

    $(".close-action").on('click', function(){
        $('.hide').css("display", "none");
        $('#new-card-title').val('');
        $('#new-card-notes').val('');
        $('#tags').empty();
        clicked_id = null;
        tags = [];
    });

    $(".full-close-action").on('click', function(){
        $('.hidden').css("display", "none");
        clicked_id = null;
        tags = [];
    });

    $("#add-card-button").on('mouseover',function(){
        $("#add-card-button").css("opacity", "0.5")
    });

    $("#add-card-button").on('mouseout',function(){
        $("#add-card-button").css("opacity", "1")
    });

    $('#edit-existing').on('click', function(){
        $('.hidden').css("display", "none");
        $('.hide').css("display", "initial");
        tags = cards[clicked_id].tags;
        $('#new-card-title').val(cards[clicked_id].title);
        $('#new-card-notes').val(cards[clicked_id].body);
        for (var t=0; t < cards[clicked_id].tags.length; t++) {
            var tag = $('<div/>').addClass('tag').html(cards[clicked_id].tags[t]);
            $('#tags').append(tag);
        }
    });

    $(".save").on('click', function(){
        if (typeof clicked_id !== "undefined" && cards[clicked_id]){
            console.log(tags);
            $.ajax({
                url: `http://localhost:3000/api/${clicked_id}`,
                type: "PATCH",
                data: {
                    title: $('#new-card-title').val(),
                    tags: tags,
                    body: $('#new-card-notes').val(),
                    images: $('#fileUploaded').val()
                },
                traditional: true,
                success: function(response){
                    console.log(response);
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
                    $('#new-card-title').val('');
                    $('#new-card-notes').val('');
                    $('#tags').empty();
                    tags = [];
                    $('.hide').css("display", "none");
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
                    title: $('#new-card-title').val(),
                    tags: tags,
                    body: $('#new-card-notes').val(),
                    images: $('#fileUploaded').val()
                },
                traditional: true,
                success: function(response){
                    appendPreviewCard(response);
                    var object_id = response.data._id;
                    cards[object_id]= response.data;
                    console.log(cards);
                    $('#new-card-title').val('');
                    $('#new-card-notes').val('');
                    $('#tags').empty();
                    tags = [];
                    $('.hide').css("display", "none");
                    clicked_id = null;
                },
                error: function(response){
                    console.log('not working!!');
                    console.log($('#fileUploaded').val())
                }
            });
        }
    });

    $('#search-input').on('keydown',function(e){
        if (e.keyCode === 13) {
            $.ajax({
                url: "http://localhost:3000/api/search",
                type: "GET",
                data: {
                    title: this.value
                },
                traditional: true,
                success: function (response) {
                    $("#preview-cards-container").empty();
                    for (var i=0; i < response.data.length; i++){
                        var tag_items = '';
                        for (j=0; j < response.data[i].tags.length; j++) {
                            tag_items += `<li>${response.data[i].tags[j]}</li>`;
                        }
                        var preview = `<div class="preview_cards" id="${response.data[i]._id}" data-index="${i}">
            <h3 class="card_title">${response.data[i].title}</h3>
            <div class="author">By: ${response.data[i].author.name}</div>
            <ul class="preview_card_tags">
            ${tag_items}
            </ul>
            <div class="card_thumbnail">
            <img src="../images/${response.data[i].images.substring(12)}" >
            </div>
            <p class="upload_date">${response.data[i].createdAt.substring(0,10)}</p>
            </div>`;
                        $("#preview-cards-container").append(preview);
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            })
        }
    });
    
    $('#new-card-tags').on('keydown',function(e){
        if (e.keyCode === 13) {
            var tag = $('<div/>').addClass('tag').html(this.value);
            tags.push(this.value);
            $('#tags').append(tag);
            this.value = null;
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

    $('#content').on('click','.preview_cards', function(){
        $('.full-tags').empty();
        clicked_id = $(this).attr('id');
        console.log(clicked_id);
        $('.full-title > h2').text(cards[clicked_id].title);

        $('.file-bar > a').attr('href', "../images/" + `${cards[clicked_id].images.substring(12)}`);
        $('.file-bar > a > img').attr('src', "../images/" + `${cards[clicked_id].images.substring(12)}`);

        $('.full-text-content > p').text(cards[clicked_id].body);
        $('.author-date').text(`By: ${cards[clicked_id].author.name} on ${cards[clicked_id].createdAt.substring(0,10)}`);
        var tag_items = '';
        for (var i=0; i < cards[clicked_id].tags.length; i++){
            tag_items += `<li>${cards[clicked_id].tags[i]}</li>`;
        };
        $('.full-tags').append(tag_items);
        $('.hidden').css("display", "initial");
    });

    $('#content').on('mouseover','.preview_cards', function() {
        $(this).css("opacity", "0.5");
    });

    $('#content').on('mouseout','.preview_cards', function() {
        $(this).css("opacity", "1");
    });

    $('#chat-input').on('keydown',function(e){
        if (e.keyCode === 13) {
            var body = $(this).val();
            $.post("http://localhost:3000/api/messages", {body}, function(){
            });
            $(this).val('');
        }
    });

    socket.on('new_chat_message', function(msg) {
        appendMessages(msg)
    });

});