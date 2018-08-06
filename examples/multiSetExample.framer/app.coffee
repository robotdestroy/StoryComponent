# Background layout

cardBackground = new Layer
	width: Screen.width
	height: Screen.height
	backgroundColor: "#fff"
	borderRadius: 16
cardBackground.sendToBack()

title = new TextLayer
	x: Align.center
	y: 192
	width: Screen.width - 60
	text: "StoryComponent"
	fontSize: 36
	fontWeight: 800
	textAlign: "center"
	color: "#222"
	parent: cardBackground
description = new TextLayer
	x: Align.center
	y: 278
	width: Screen.width - 64
	text: "Tap the circle above to launch multiple sets of stories. Tap the right of a story to advance to the next.\r\n \r\n You can swipe up from the bottom at any time to exit the stories or you will automatically return at the end.\r\n \r\n To create a StoryComponent, initialize it with an array of images or videos. Begin playback by calling the start function."
	fontSize: 16
	fontWeight: 400
	textAlign: "center"
	parent: cardBackground
linkURL = new TextLayer
	x: Align.center
	y: 556
	width: Screen.width - 72
	text: "Learn More"
	fontSize: 15
	fontWeight: 500
	color: "#007AFF"
	textAlign: "center"
	parent: cardBackground

linkURL.onTap ->
	window.open('https://github.com/robotdestroy/StoryComponent', '_new')

storyPlaceholder1 = new Layer
	y: 56
	x: Align.center
	width: 82
	height: 82
	borderRadius: 82
	backgroundColor: "rgba(0,0,0,0.05)"
storyPlaceholder1.parent = cardBackground
storyPlaceholder2 = storyPlaceholder1.copy()
storyPlaceholder2.parent = cardBackground
storyPlaceholder3 = storyPlaceholder1.copy()
storyPlaceholder3.parent = cardBackground
storyPlaceholder4 = storyPlaceholder1.copy()
storyPlaceholder4.parent = cardBackground
storyPlaceholder1.x = ( storyPlaceholder1.x - 190 )
storyPlaceholder2.x = ( storyPlaceholder2.x - 95 )
storyPlaceholder3.x = ( storyPlaceholder3.x + 95 )
storyPlaceholder4.x = ( storyPlaceholder4.x + 190 )

# Setup stories
{StoryComponent} = require "StoryComponent"

exampleSet1 = new StoryComponent
	stories: ["images/locutus1.png", "images/locutus2.png"]

exampleSet2 = new StoryComponent
	stories: ["images/jason1.png"]

exampleSet3 = new StoryComponent
	stories: ["images/andrea1.png", "images/andrea2.png", "images/andrea3.png"]

# Setup stories display

setsContainer = new Layer
	width: Screen.width * 3
	height: Screen.height
	backgroundColor: 'transparent'

exampleSet1.width = Screen.width
exampleSet1.height = Screen.height
exampleSet1.clip = true
exampleSet1.shadowY = 8
exampleSet1.shadowBlur = 60
exampleSet1.shadowColor = "rgba(0,0,0,0.3)"

exampleSet2.width = Screen.width
exampleSet2.height = Screen.height
exampleSet2.clip = true
exampleSet2.shadowY = 8
exampleSet2.shadowBlur = 60
exampleSet2.shadowColor = "rgba(0,0,0,0.3)"

exampleSet3.width = Screen.width
exampleSet3.height = Screen.height
exampleSet3.clip = true
exampleSet3.shadowY = 8
exampleSet3.shadowBlur = 60
exampleSet3.shadowColor = "rgba(0,0,0,0.3)"

# Story viewer states

exampleSet1.states.small =
	y: -90
	scale: 0.22
	height: Screen.width
	borderRadius: Screen.width/2
	borderColor: "#fff"
	borderWidth: 12

exampleSet1.states.large =
	y: 0
	scale: 1
	height: Screen.height
	borderRadius: 12
	borderColor: "#000"
	borderWidth: 0

exampleSet2.states.small =
	y: -90
	scale: 0.22
	height: Screen.width
	borderRadius: Screen.width/2
	borderColor: "#fff"
	borderWidth: 12

exampleSet2.states.large =
	y: 0
	scale: 1
	height: Screen.height
	borderRadius: 12
	borderColor: "#000"
	borderWidth: 0

exampleSet3.states.small =
	y: -90
	scale: 0.22
	height: Screen.width
	borderRadius: Screen.width/2
	borderColor: "#fff"
	borderWidth: 12

exampleSet3.states.large =
	y: 0
	scale: 1
	height: Screen.height
	borderRadius: 12
	borderColor: "#000"
	borderWidth: 0

cardBackground.states.active =
	scale: 1
	brightness: 100

cardBackground.states.inactive =
	scale: 0.90
	brightness: 80

exampleSet1.states.switchInstant "small"
exampleSet2.states.switchInstant "large"
exampleSet3.states.switchInstant "large"
cardBackground.states.switchInstant "active"

exampleSet1.x = 0
exampleSet1.parent = setsContainer
exampleSet2.x = Screen.width
exampleSet2.parent = setsContainer
exampleSet3.x = 2 * Screen.width
exampleSet3.parent = setsContainer

exampleSet1.animationOptions =
	curve: "spring(230,28,7)"
exampleSet2.animationOptions =
	curve: "spring(230,28,7)"
exampleSet3.animationOptions =
	curve: "spring(230,28,7)"
cardBackground.animationOptions =
	curve: "spring(230,28,7)"

# Start story action

singleSwipe = 0

storyHit = new Layer
	width: 80
	height: 80
	x: 147
	y: 58
	opacity: 0

storyHit.onClick ->
	storyHit.scale = 0
	exampleSet1.animate("large")
	cardBackground.animate("inactive")
	exampleSet1._startStoriesPlayback()
	singleSwipe = 0
	setsContainer.x = 0

# End story listener to trigger return animation

exampleSet1._endOfUpdatesEvent.on "change:x", ->
	if exampleSet1._endOfUpdatesEvent.x == 1
		exampleSet1._endOfUpdatesEvent.x = 0
		exampleSet2.states.switchInstant "large"
		exampleSet2._startStoriesPlayback()
		setsContainer.animate
			properties:
				x: -Screen.width
			time: 0.25

exampleSet2._endOfUpdatesEvent.on "change:x", ->
	if exampleSet2._endOfUpdatesEvent.x == 1
		exampleSet2._endOfUpdatesEvent.x = 0
		exampleSet3.states.switchInstant "large"
		exampleSet3._startStoriesPlayback()
		setsContainer.animate
			properties:
				x: -2 * Screen.width
			time: 0.25

exampleSet3._endOfUpdatesEvent.on "change:x", ->
	if exampleSet3._endOfUpdatesEvent.x == 1
		exampleSet3._endOfUpdatesEvent.x = 0
		storyHit.scale = 1
		exampleSet3.animate("small")
		cardBackground.animate("active")
		exampleSet1._resetStoriesPlayback()
		exampleSet2._resetStoriesPlayback()
		exampleSet3._resetStoriesPlayback()
		exampleSet1.states.switchInstant "small"
		exampleSet2.states.switchInstant "large"

Screen.on Events.EdgeSwipeBottom, (event) ->
	if ( ( singleSwipe == 0 ) && ( setsContainer.x == 0 ) )
		exampleSet1.animate("small")
		cardBackground.animate("active")
		exampleSet1._endOfUpdatesEvent.x = 0
		storyHit.scale = 1
		singleSwipe = 1
	if ( ( singleSwipe == 0 ) && ( setsContainer.x == -Screen.width ) )
		exampleSet2.animate("small")
		cardBackground.animate("active")
		exampleSet2._endOfUpdatesEvent.x = 0
		exampleSet1.states.switchInstant "small"
		storyHit.scale = 1
		singleSwipe = 1
	if ( ( singleSwipe == 0 ) && ( setsContainer.x == ( -2 * Screen.width ) ) )
		exampleSet3.animate("small")
		cardBackground.animate("active")
		exampleSet3._endOfUpdatesEvent.x = 0
		exampleSet2.states.switchInstant "small"
		storyHit.scale = 1
		singleSwipe = 1
