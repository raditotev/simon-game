var switchedOn = false;
var strictMode = false;
var game = {  
              sequence: [],
              input: [],
              counter: 1,  
              addToSequence: function(el){ this.sequence.push(el) },
              addToInput:    function(el){ this.input.push(el) }
            }
var keys_map = {
                1: "#green",
                2: "#red",
                3: "#yellow",
                4: "#blue"
              }

var green = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
var red = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
var yellow = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
var blue = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
var warn = new Audio('http://www.pacdv.com/sounds/interface_sound_effects/sound8.mp3');
var win = new Audio('http://www.pacdv.com/sounds/miscellaneous_sounds/fireworks-1.wav');

var switchOnOff = function(){    
                    if (switchedOn){
                      $("#switch-button").animate({left: 0}, 20);
                      switchedOn = false;                       
                      reset();
                      $('#strict-indicator').css({"background" : "#430710"});
                      $('#counter span').css({"color" : "#430710"});              
                      strictMode = false;
                    }else{
                      $("#switch-button").animate({left: 13}, 20);
                      switchedOn = true;
                      $('#counter span').css({"color" : "#DC0D29"});  
                      $('#counter span').text("--");
                    }  
                  }
var startButton = function(){
                    $(this).animate({top: 2}, 100).animate({top: 0}, 100); 
                    reset();
                  }

var reset = function(){   
              game.sequence = [];
              game.input = [];                      
              game.counter = 1;
              timerOff();  
              $('#counter span').text("--"); 
              $("#green, #red, #yellow, #blue").off("click"); 
              startNewGame(game);
            }

var startNewGame = function(game){     
                    if(switchedOn){     
                      blink();
                      $('#counter span').promise().done(function(){      
                        $('#counter span').text("01");            
                        game.addToSequence(keys_map[Math.floor(Math.random() * 4) + 1]);      
                        simonSaid(game);
                      });   
                    }
                  }

var switchStrict = function(){
                    $(this).animate({top: 2}, 100).animate({top: 0}, 100);
                    if (switchedOn){
                      if (strictMode){
                        strictMode = false;
                        $('#strict-indicator').css({"background" : "#430710"});
                      } else {
                        strictMode = true;
                        $('#strict-indicator').css({"background" : "#DC0D29"});
                      }    
                    } 
                  }

var simonSaid = function(game, iterations = 0){  
                  if (switchedOn){
                    var i = iterations;
                    if (i < game.sequence.length){
                      visualize(game.sequence[i]);
                      $(game.sequence[i]).promise().done(function(){
                        i++;
                        simonSaid(game, i);
                      });  
                    } else {    
                      timerOn(game);
                      userInput(game);     
                    } 
                  }else{
                    return;
                  }
                }

var warning = function(game){
                if (switchedOn){
                  warn.play();
                  game.input = [];      
                  $('#counter span').text("!!")
                  blink();
                  $('#counter span').promise().done(function(){      
                    if (strictMode){        
                      reset();        
                    } else {
                      $('#counter span').text(("0" + game.counter).slice(-2));
                      simonSaid(game);
                    }            
                  });
                  $("#green, #red, #yellow, #blue").off("click"); 
                } else {
                  return;
                } 
              }

var timer;

var timerOn = function(game){ 
                if (switchedOn){
                  timer = setTimeout(function(){
                    warning(game);
                  }, 5000);  
                } else {
                  return;
                }  
              }

var timerOff = function(){  
                  clearTimeout(timer);   
                }

var userInput = function(game){  
                  $("#green, #red, #yellow, #blue").click(function(event){  
                    $("#green, #red, #yellow, #blue").off("click");    
                    timerOff();       
                    var selector = "#" + $(this).attr('id');
                    visualize(selector);
                    $(selector).promise().done(function(){             
                      game.addToInput(selector); 
                      checkValidity(game, selector);                  
                    });         
                  });  
                }

var checkValidity = function(game, selector){
                      if (selector == game.sequence[game.input.length - 1]){
                        checkSequence(game); 
                      } else {
                        warning(game);
                      }
                    }

var checkSequence = function(game){    
                      if (game.input.length == game.sequence.length){
                        if (game.input.length == 20){
                          win.play();
                          setTimeout(function(){
                            var anotherGame = confirm("You're great! Do you want to play another one?");
                            if (anotherGame == true){
                              reset();        
                            } else {
                              switchOnOff();
                            }    
                          }, 4000);                                                    
                          return;
                        }
                        game.input = [];
                        nextSequence(game);
                      } else {
                        $("#green, #red, #yellow, #blue").on("click");
                        timerOn(game);
                        userInput(game);
                      }
                    }

var nextSequence = function(game){    
                      game.counter++;
                      $('#counter span').text(("0" + game.counter).slice(-2));
                      setTimeout(function(){    
                        game.addToSequence(keys_map[Math.floor(Math.random() * 4) + 1]);      
                        simonSaid(game);
                      }, 1000);  
                    }

var visualize = function(selector){  
                  if (selector == "#green"){
                    green.play();
                    $(selector).animate({'background-color' : "#37fb8f"}, 400)
                                .animate({'background-color' : "#03A64B"}, 400);
                  } else if (selector == "#red"){
                    red.play();
                    $(selector).animate({'background-color' : "#ee444d"}, 400)
                                .animate({'background-color' : "#9F0F17"}, 400);
                  } else if (selector == "#yellow"){
                    yellow.play();
                    $(selector).animate({'background-color' : "#f7db6e"}, 400)
                                .animate({'background-color' : "#CBA60C"}, 400);
                  } else if(selector == "#blue"){
                    blue.play();
                    $(selector).animate({'background-color' : "#99caff"}, 400)
                                .animate({'background-color' : "#1D8CFF"}, 400);
                  }
                }

var blink = function(){
              for (var i = 0; i < 2; i++){
                $('#counter span').fadeOut(150).fadeIn(150);  
              }  
            }


$(function(){
  
  $('#switch-button').click(switchOnOff);
  $('#start-button').click(startButton);
  $('#strict-button').click(switchStrict);
});