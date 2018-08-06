# Require module
{StoryComponent} = require "StoryComponent"

# Simple example
exampleSet = new StoryComponent
	stories: ["", "", ""]

# Customized example
# exampleSet = new StoryComponent
# 	stories: ["", "", ""]
# 	progressBarHorizontalPadding: 20
# 	progressBarVerticalPadding: 20
# 	progressBarHeight: 20
# 	progressBarGradient: true
# 	timePerStory: 3

# Start stories playback
exampleSet._startStoriesPlayback()