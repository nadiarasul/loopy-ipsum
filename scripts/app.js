// First we create an array of words and phrases to generate the lorem paragraph, stored in a JSON file

// create namespace for the app
var aliceApp = {};
// global var to hold data from the json file
var aliceWords = [];

// initialize the app
// get data from JSON file and get user choice from radio buttons
aliceApp.init = function(){
	aliceApp.getData();
	aliceApp.getUserChoice();
};

// get the text from file
aliceApp.getData = function(){
	$.getJSON("scripts/wordlist.json",function(data){
		aliceWords = data.results;
	});
};

// check what length the user needs
aliceApp.getUserChoice = function(){
	// when user clicks choice labels, empty out any previous results/errors/logs
	$('.choice').click(function(){
		$('.error, .log, .result, .copy').empty();
		$('.result').removeClass('border');
	});

	// when user submits choice
	// first, empty our previous results/errors/logs
	$('form').on('submit', function(e){
		e.preventDefault();
		$('.error, .log, .result, .copy').empty();

		// store user choice value in a var
		var loremSize = $('input[name=loremSize]:checked').val();

		// if no value is selected on submit, display err
		// otherwise, display results
		if (loremSize == null) {
			var err = $('<p>').text('Please choose a length');
			$('.error').append(err);
		}
		else{
			aliceApp.generateLorem(loremSize);
		}
	});
};

// generate lorem text for the length user picked
aliceApp.generateLorem = function(loremSize){
	var aliceLorem = [];

	// for loop to select random words from the json file
	// push them into the empty array
	for (var i = 0 ; i < loremSize; i++) {
		var randomNumber = Math.floor(Math.random() * loremSize) + 1;
		var aliceWord = aliceWords[randomNumber];
		aliceLorem + aliceLorem.push(aliceWord);
	}
	// console.log(aliceLorem);
	
	// join the items in array with a space
	var generatedLorem = aliceLorem.join(' ');

	aliceApp.punctuation(generatedLorem);
};

// make sure the paragraph ends with appropriate punctuation
aliceApp.punctuation = function(generatedLorem){
	var lastChar = generatedLorem.charAt(generatedLorem.length - 1);
	
	var punctuation = ['!', '?', '.', ','];

	if (punctuation.indexOf(lastChar) === -1){
		generatedLorem += '.';
	} 

	var firstLetter = generatedLorem.charAt(0);
	var uppercaseFirstLetter = generatedLorem.charAt(0).toUpperCase();
	var stringWithoutFirstLetter = generatedLorem.slice(1)

	function upperCase(generatedLorem){
		return uppercaseFirstLetter + stringWithoutFirstLetter;
	}

	aliceApp.displayLorem(upperCase);
};

// and the lorem text always begins with a capital letter
aliceApp.displayLorem = function(upperCase){
	$('.result').addClass('border');
	var finalText = $('<p>').text(upperCase);
	$('.result').append(finalText);
	var copyButton = $('<button>').text('COPY ME').attr('class', 'btn').attr('data-clipboard-target', '#aliceLorem');
	$('.copy').append(copyButton);

	aliceApp.copyLorem();
};

// allow users to easily copy the lorem for use
aliceApp.copyLorem = function(){
	// create a new instance of clipboard plugin for the button element
	// using the class selector: .buttonClass
	var clipboard =  new Clipboard('.btn');

	// when text is copied into clipboard use it
	clipboard.on('success', function(e) {
		console.info('Action:', e.action);
		console.info('Text:', e.text);
		console.info('Trigger:', e.trigger);
		$('.log').empty();
		var copied = $('<p>').text('Copied!');
		$('.log').append(copied);
		$('.btn').attr('title', 'Copied');
		e.clearSelection();
	});

	clipboard.on('error', function(e) {
		console.error('Action:', e.action);
		console.error('Trigger:', e.trigger);
	});

	$('.btn').attr('title', 'Copied');
}

// initialize app in document ready
$(function () {
	aliceApp.init();
});