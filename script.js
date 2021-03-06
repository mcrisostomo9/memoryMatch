$(document).ready(function(){
    $('.logo').delay(2000).animate({ left: '17%', top:'15%'}, 1000);
    $('.theme_song_1').trigger('play');
    $('.stats_container').hide();
    $('.heroes_win').hide();
    $('.villains_win').hide();
    $('.portrait_mode_statement').hide();
});

var game_mode;

//OPERATIONS ON SCREEN LOAD
function hero_selected(){
    $('.option_select_sound').trigger('play');
    $('.ultron').addClass('grayscale').removeClass('dropshadow');
    $('.select_villain').removeClass('dropshadow');
    $('.select_hero').addClass('dropshadow');
    $('.captain_america').removeClass('grayscale').addClass('dropshadow');
    $('.select_play').off('click', play_game).on('click', play_game);
    game_mode = 'hero';
}

function villain_selected(){
    $('.option_select_sound').trigger('play');
    $('.captain_america').addClass('grayscale').removeClass('dropshadow');
    $('.select_hero').removeClass('dropshadow');
    $('.select_villain').addClass('dropshadow');
    $('.ultron').removeClass('grayscale').addClass('dropshadow');
    $('.select_play').off('click', play_game).on('click', play_game);
    game_mode = 'villain';
}

function play_game(){
    $('.restart_sound').trigger('play');
    $('.loading_screen').addClass('animated fadeOut')
    if(game_mode === 'hero'){
        $('body').addClass('hero_background');
    }
    else if(game_mode === 'villain'){
        $('body').addClass('villain_background');
    }
    $('.stats_container').show();
    $('.logo_area').click(function(){
        location.reload(true);
    });
    display_stats();
    create_cards();
    $('.card').click(card_clicked);
}

//CREATE CARDS DYNAMICALLY
var cards = [];

function create_cards() {
    for(var i=0; i<2; i++){
        for(var x=1; x<=14; x++){
            cards.push('assets/front_'+x+'.png');
        }
    }

    cards.sort(function(a, b){return 0.5 - Math.random()});

    for(var j=0; j<7; j++){
        for(var k=1; k<5; k++){
            $('.row'+k).append('<div class="card">');
            $('.row'+k).find(".card:eq("+j+")").append($('<img class="front">').attr({'src': cards[0]}));
            $('.row'+k).find(".card:eq("+j+")").append('<img class="back" src="assets/card_back.jpg">');
            cards.splice(0,1);
        }
    }
}

//GAME OPERATION
var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 14;
var match_counter = 0;
var matches = 0;
var attempts = 0;
var accuracy = 0;
var games_played = 0;


function display_stats(){
    $('.games_played .value').text(games_played);
    $('.attempts .value').text(attempts);
    $('.accuracy .value').text(accuracy+"%");
}

function card_clicked() {
    if($(this).hasClass('matched')){
        return;
    }
    if($(this).find('.back').css('display') == 'none'){
        return;
    }
    if(first_card_clicked===null){
        $('.card_click_sound').trigger('play');
        first_card_clicked= $(this);
        $(first_card_clicked).find('.back').hide();
    }
    else {
        second_card_clicked = $(this);
        $(second_card_clicked).find(".back").hide();
        var first_card_img = $(first_card_clicked).find('img.front').attr('src')
        var second_card_img = $(second_card_clicked).find('img.front').attr('src')
        attempts++;
        if(first_card_img === second_card_img) {
            $('.match_sound').prop('volume', 0.2).trigger('play');
            $(first_card_clicked).addClass('matched');
            $(second_card_clicked).addClass('matched');
            first_card_clicked = null;
            second_card_clicked = null;
            match_counter += 1;
            matches++;
            if(match_counter===total_possible_matches){ //WIN CONDITION
                $('.game_board').delay(1500).fadeOut();
                $('.win_sound').trigger('play');
                $('.theme_song_1').trigger('pause');
                setTimeout(function() {
                    $('.theme_song_2').trigger('play');
                }, 2000);
                if(game_mode === 'hero'){
                    $('.heroes_win').delay(1500).fadeIn();
                }
                else {
                    $('.villains_win').delay(1500).fadeIn();
                }
            }
        }
        else{
            $('.error_sound').trigger('play');
            $('.card').off();
            setTimeout(function(){
                $(first_card_clicked).find('.back').show();
                $(second_card_clicked).find('.back').show();
                first_card_clicked = null;
                second_card_clicked = null;
                $('.card').click(card_clicked);
            },1500);
        }
        accuracy = Math.floor((matches / attempts) * 100);
        display_stats();
    }
}

function reset_game(){
    games_played++;
    accuracy=0;
    matches=0;
    attempts=0;
    match_counter=0;
    display_stats();
    $('.theme_song_2').trigger('pause');
    $('.restart_sound').trigger('play');
    $('.theme_song_1').prop('currentTime',0).trigger('play');
    $('.heroes_win, .villains_win').hide();
    $('.game_board').show();
    $('.row').empty();
    create_cards();
    $('.card').click(card_clicked);
}
