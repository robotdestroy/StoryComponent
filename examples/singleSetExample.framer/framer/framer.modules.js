require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"StoryComponent":[function(require,module,exports){

/*
	 * Story Component

	 * Example
	{StoryComponent} = require "StoryComponent"
	exampleSet = new StoryComponent
		progressBarHorizontalPadding: 12
		progressBarVerticalPadding: 12
		progressBarHeight: 4
		progressBarGradient: true
		timePerStory: 3
		stories: [ "images/1.png", "images/2.png", "images/3.png" ]
 */
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.StoryComponent = (function(superClass) {
  extend(StoryComponent, superClass);

  function StoryComponent(options1) {
    var options;
    this.options = options1 != null ? options1 : {};
    this._setupLayout = bind(this._setupLayout, this);
    options = _.defaults(this.options, {
      progressBarHorizontalPadding: 12,
      progressBarVerticalPadding: 12,
      progressBarHeight: 4,
      progressBarGradient: true,
      timePerStory: 3,
      stories: [""]
    });
    StoryComponent.__super__.constructor.call(this, this.options);
    this._numberOfUpdates = this.options.stories.length;
    this._totalTime = this._numberOfUpdates * this.options.timePerStory;
    this._setupLayout();
  }

  StoryComponent.prototype._setupLayout = function() {
    var authorStoryHolder, currentStoryOfAuthor, i, longPress, number, numberOfUpdates, progressBarHolderForLoop, progressBarHolderInitialSectionWidthForLoop, progressBarHolderInitialWidth, ref, timePerStory;
    longPress = false;
    currentStoryOfAuthor = 1;
    timePerStory = this.options.timePerStory;
    numberOfUpdates = this.options.stories.length;
    this._storiesContainer = new Layer({
      backgroundColor: "#292929",
      width: Screen.width,
      height: Screen.height,
      name: "Stories Container",
      parent: this,
      clip: true
    });
    this._nextHit = new Layer({
      width: Screen.width / 1.5,
      height: Screen.height,
      x: Align.right,
      backgroundColor: "rgba(0,0,0,0)",
      name: "Next hit",
      parent: this._storiesContainer
    });
    this._backHit = new Layer({
      width: Screen.width / 3,
      height: Screen.height,
      x: Align.left,
      backgroundColor: "rgba(0,0,0,0)",
      name: "Back hit",
      parent: this._storiesContainer
    });
    this._endOfUpdatesEvent = new Layer({
      width: 1,
      height: 1,
      x: 0,
      y: 0,
      backgroundColor: "rgba(0,0,0,0)",
      name: "Variable Holder",
      parent: this._storiesContainer
    });
    this._progressBarHolderInitialWidth = Screen.width - (this.options.progressBarHorizontalPadding * 2);
    this._progressBarHolderInitialSectionWidth = this._progressBarHolderInitialWidth / this._numberOfUpdates;
    this._progressBarHolder = new Layer({
      height: this.options.progressBarHeight,
      width: this._progressBarHolderInitialWidth,
      x: Align.center,
      y: this.options.progressBarVerticalPadding,
      backgroundColor: "#00ffffff",
      name: "Progress Bar Holder",
      parent: this._storiesContainer
    });
    this._authorStoryHolder = new Layer({
      width: Screen.width * this._numberOfUpdates,
      height: Screen.height,
      name: "Auther's Stories Holder",
      parent: this._storiesContainer
    });
    this._authorStoryHolder.placeBehind(this._progressBarHolder);
    authorStoryHolder = this._authorStoryHolder;
    progressBarHolderInitialWidth = this._progressBarHolderInitialWidth;
    progressBarHolderForLoop = this._progressBarHolder;
    progressBarHolderInitialSectionWidthForLoop = this._progressBarHolderInitialSectionWidth;
    this._progressBarHolder.onChange("width", function() {
      var authorProgress, i, number, ref, results;
      authorProgress = Utils.modulate(this.width, [0, progressBarHolderInitialWidth], [0, 1]);
      results = [];
      for (number = i = 0, ref = numberOfUpdates; 0 <= ref ? i < ref : i > ref; number = 0 <= ref ? ++i : --i) {
        if ((progressBarHolderForLoop.width < (progressBarHolderInitialWidth * (number + 1))) && (progressBarHolderForLoop.width > (progressBarHolderInitialSectionWidthForLoop * number))) {
          currentStoryOfAuthor = number + 1;
          results.push(authorStoryHolder.x = -Screen.width * number);
        } else {
          results.push(void 0);
        }
      }
      return results;
    });
    if (this._numberOfUpdates > 1) {
      numberOfUpdates = this._numberOfUpdates;
      for (number = i = 0, ref = numberOfUpdates; 0 <= ref ? i < ref : i > ref; number = 0 <= ref ? ++i : --i) {
        this._story = new Layer({
          backgroundColor: Utils.randomColor(),
          image: this.options.stories[number],
          width: Screen.width,
          height: Screen.height,
          x: Screen.width * number,
          parent: this._authorStoryHolder
        });
        this._story.name = "Story " + (number + 1);
        this._progressBarSection = new Layer({
          backgroundColor: "#ffffff",
          height: this.options.progressBarHeight,
          width: (this._progressBarHolder.width - this.options.progressBarHorizontalPadding) / this._numberOfUpdates,
          x: number * ((this._progressBarHolder.width / this._numberOfUpdates) + ((this.options.progressBarHorizontalPadding / 2) / this._numberOfUpdates)),
          borderRadius: this.options.progressBarHeight,
          parent: this._progressBarHolder
        });
        this._progressBarSection.name = "Progress Bar Section " + number;
      }
    } else {
      this._story1 = new Layer({
        backgroundColor: Utils.randomColor(),
        image: this.options.stories[0],
        width: Screen.width,
        height: Screen.height,
        x: 0,
        parent: this._authorStoryHolder,
        name: "Story"
      });
      this._progressBarSection1 = new Layer({
        backgroundColor: "#ffffff",
        height: this.options.progressBarHeight,
        width: this._progressBarHolder.width,
        x: Align.left,
        borderRadius: this.options.progressBarHeight,
        parent: this._progressBarHolder
      });
    }
    this._progressBarHolderBG = this._progressBarHolder.copy();
    this._progressBarHolderBG.name = "Progress Bar Holder Background";
    this._progressBarHolderBG.opacity = 0.25;
    this._progressBarHolderBG.parent = this._storiesContainer;
    if (this.options.progressBarGradient === true) {
      this._progressBarBackgroundGradient = new Layer({
        width: Screen.width,
        height: (this.options.progressBarVerticalPadding * 2) + (this.options.progressBarHeight + 4),
        gradient: {
          start: "rgba(0,0,0,0)",
          end: "rgba(0,0,0,0.3)"
        },
        name: "Progress Bar Gradient",
        parent: this._storiesContainer
      });
    }
    this._progressBarHolderBG.bringToFront();
    this._progressBarHolder.bringToFront();
    this._progressBarHolder.clip = true;
    this._progressBarHolder.width = 0;
    this._nextHit.onTouchStart((function(_this) {
      return function() {
        return _this._stopStoriesPlayback();
      };
    })(this));
    this._backHit.onTouchStart((function(_this) {
      return function() {
        return _this._stopStoriesPlayback();
      };
    })(this));
    this._nextHit.progressBarHolder = this._progressBarHolder;
    this._nextHit.progressBarHolderBG = this._progressBarHolderBG;
    this._nextHit.numberOfUpdates = this._numberOfUpdates;
    this._backHit.progressBarHolder = this._progressBarHolder;
    this._backHit.progressBarHolderBG = this._progressBarHolderBG;
    this._backHit.numberOfUpdates = this._numberOfUpdates;
    this._nextHit.onTouchEnd((function(_this) {
      return function() {
        if (longPress === false) {
          _this._progressBarHolder.width = (_this._progressBarHolderBG.width / numberOfUpdates) * currentStoryOfAuthor;
          currentStoryOfAuthor++;
          if (currentStoryOfAuthor >= numberOfUpdates) {
            currentStoryOfAuthor = currentStoryOfAuthor;
          }
          _this._totalTime = (numberOfUpdates - (currentStoryOfAuthor - 1)) * timePerStory;
          return _this._startStoriesPlayback();
        } else {
          _this._startStoriesPlayback();
          return longPress = false;
        }
      };
    })(this));
    this._backHit.onTouchEnd((function(_this) {
      return function() {
        if (longPress === false) {
          if (currentStoryOfAuthor > 1) {
            _this._progressBarHolder.width = (_this._progressBarHolderBG.width / numberOfUpdates) * (currentStoryOfAuthor - 2);
          }
          currentStoryOfAuthor--;
          if (currentStoryOfAuthor < 1) {
            currentStoryOfAuthor = 1;
          }
          _this._totalTime = (numberOfUpdates - (currentStoryOfAuthor - 1)) * timePerStory;
          return _this._startStoriesPlayback();
        } else {
          _this._startStoriesPlayback();
          return longPress = false;
        }
      };
    })(this));
    this._nextHit.onLongPress(function() {
      return longPress = true;
    });
    return this._backHit.onLongPress(function() {
      return longPress = true;
    });
  };

  StoryComponent.prototype._startStoriesPlayback = function() {
    this._progressBarHolderAnimation = this._progressBarHolder.animate({
      properties: {
        width: Screen.width
      },
      curve: Bezier.linear,
      time: this._totalTime
    });
    return this._progressBarHolderAnimation.on(Events.AnimationEnd, (function(_this) {
      return function(animation, layer) {
        return _this._endOfUpdatesEvent.x = 1;
      };
    })(this));
  };

  StoryComponent.prototype._stopStoriesPlayback = function() {
    return this._progressBarHolderAnimation.stop();
  };

  StoryComponent.prototype._resetStoriesPlayback = function() {
    this._progressBarHolderAnimation.finish();
    return this._progressBarHolderAnimation.reset();
  };

  return StoryComponent;

})(Layer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2NoYXJsaWVkZWV0cy9Ecm9wYm94IChQZXJzb25hbCkvRGVzaWduL0ZyYW1lci9TdG9yeUNvbXBvbmVudC9TdG9yeUNvbXBvbmVudC9leGFtcGxlcy9zaW5nbGVTZXRFeGFtcGxlLmZyYW1lci9tb2R1bGVzL1N0b3J5Q29tcG9uZW50LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5cdCMgU3RvcnkgQ29tcG9uZW50XG5cblx0IyBFeGFtcGxlXG5cdHtTdG9yeUNvbXBvbmVudH0gPSByZXF1aXJlIFwiU3RvcnlDb21wb25lbnRcIlxuXHRleGFtcGxlU2V0ID0gbmV3IFN0b3J5Q29tcG9uZW50XG5cdFx0cHJvZ3Jlc3NCYXJIb3Jpem9udGFsUGFkZGluZzogMTJcblx0XHRwcm9ncmVzc0JhclZlcnRpY2FsUGFkZGluZzogMTJcblx0XHRwcm9ncmVzc0JhckhlaWdodDogNFxuXHRcdHByb2dyZXNzQmFyR3JhZGllbnQ6IHRydWVcblx0XHR0aW1lUGVyU3Rvcnk6IDNcblx0XHRzdG9yaWVzOiBbIFwiaW1hZ2VzLzEucG5nXCIsIFwiaW1hZ2VzLzIucG5nXCIsIFwiaW1hZ2VzLzMucG5nXCIgXVxuIyMjXG5cbmNsYXNzIGV4cG9ydHMuU3RvcnlDb21wb25lbnQgZXh0ZW5kcyBMYXllclxuXHRjb25zdHJ1Y3RvcjogKEBvcHRpb25zPXt9KSAtPlxuXG5cdFx0b3B0aW9ucyA9IF8uZGVmYXVsdHMgQG9wdGlvbnMsXG5cdFx0XHRwcm9ncmVzc0Jhckhvcml6b250YWxQYWRkaW5nOiAxMlxuXHRcdFx0cHJvZ3Jlc3NCYXJWZXJ0aWNhbFBhZGRpbmc6IDEyXG5cdFx0XHRwcm9ncmVzc0JhckhlaWdodDogNFxuXHRcdFx0cHJvZ3Jlc3NCYXJHcmFkaWVudDogdHJ1ZVxuXHRcdFx0dGltZVBlclN0b3J5OiAzXG5cdFx0XHRzdG9yaWVzOiBbXCJcIl1cblxuXHRcdHN1cGVyIEBvcHRpb25zXG5cblx0XHRAX251bWJlck9mVXBkYXRlcyA9IEBvcHRpb25zLnN0b3JpZXMubGVuZ3RoXG5cdFx0QF90b3RhbFRpbWUgPSAoIEBfbnVtYmVyT2ZVcGRhdGVzICogQG9wdGlvbnMudGltZVBlclN0b3J5IClcblxuXHRcdEBfc2V0dXBMYXlvdXQoKVxuXG5cdF9zZXR1cExheW91dDogPT5cblxuXHRcdGxvbmdQcmVzcyA9IGZhbHNlXG5cdFx0Y3VycmVudFN0b3J5T2ZBdXRob3IgPSAxXG5cdFx0dGltZVBlclN0b3J5ID0gQG9wdGlvbnMudGltZVBlclN0b3J5XG5cdFx0bnVtYmVyT2ZVcGRhdGVzID0gQG9wdGlvbnMuc3Rvcmllcy5sZW5ndGhcblxuXHRcdCMgTGF5b3V0IGNvbnN0cnVjdGlvblxuXG5cdFx0QF9zdG9yaWVzQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzI5MjkyOVwiXG5cdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRcdG5hbWU6IFwiU3RvcmllcyBDb250YWluZXJcIlxuXHRcdFx0cGFyZW50OiB0aGlzXG5cdFx0XHRjbGlwOiB0cnVlXG5cblx0XHQjIEhpdCBhcmVhcyBjb25zdHJ1Y3Rpb25cblxuXHRcdEBfbmV4dEhpdCA9IG5ldyBMYXllclxuXHRcdFx0d2lkdGg6IFNjcmVlbi53aWR0aCAvIDEuNVxuXHRcdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0XHR4OiBBbGlnbi5yaWdodFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcInJnYmEoMCwwLDAsMClcIlxuXHRcdFx0bmFtZTogXCJOZXh0IGhpdFwiXG5cdFx0XHRwYXJlbnQ6IEBfc3Rvcmllc0NvbnRhaW5lclxuXG5cdFx0QF9iYWNrSGl0ID0gbmV3IExheWVyXG5cdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoIC8gM1xuXHRcdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0XHR4OiBBbGlnbi5sZWZ0XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgwLDAsMCwwKVwiXG5cdFx0XHRuYW1lOiBcIkJhY2sgaGl0XCJcblx0XHRcdHBhcmVudDogQF9zdG9yaWVzQ29udGFpbmVyXG5cblx0XHRAX2VuZE9mVXBkYXRlc0V2ZW50ID0gbmV3IExheWVyXG5cdFx0XHR3aWR0aDogMVxuXHRcdFx0aGVpZ2h0OiAxXG5cdFx0XHR4OiAwXG5cdFx0XHR5OiAwXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgwLDAsMCwwKVwiXG5cdFx0XHRuYW1lOiBcIlZhcmlhYmxlIEhvbGRlclwiXG5cdFx0XHRwYXJlbnQ6IEBfc3Rvcmllc0NvbnRhaW5lclxuXG5cdFx0IyBXaWR0aHMgdmFsdWVzIGZvciBwcm9ncmVzc1xuXG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlckluaXRpYWxXaWR0aCA9ICggU2NyZWVuLndpZHRoICkgLSAoIEBvcHRpb25zLnByb2dyZXNzQmFySG9yaXpvbnRhbFBhZGRpbmcgKiAyIClcblx0XHRAX3Byb2dyZXNzQmFySG9sZGVySW5pdGlhbFNlY3Rpb25XaWR0aCA9ICggQF9wcm9ncmVzc0JhckhvbGRlckluaXRpYWxXaWR0aCAvIEBfbnVtYmVyT2ZVcGRhdGVzIClcblxuXHRcdCMgUHJvZ3Jlc3MgYmFyIGNvbnN0cnVjdGlvblxuXG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlciA9IG5ldyBMYXllclxuXHRcdFx0aGVpZ2h0OiBAb3B0aW9ucy5wcm9ncmVzc0JhckhlaWdodFxuXHRcdFx0d2lkdGg6IEBfcHJvZ3Jlc3NCYXJIb2xkZXJJbml0aWFsV2lkdGhcblx0XHRcdHg6IEFsaWduLmNlbnRlclxuXHRcdFx0eTogQG9wdGlvbnMucHJvZ3Jlc3NCYXJWZXJ0aWNhbFBhZGRpbmdcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCIjMDBmZmZmZmZcIlxuXHRcdFx0bmFtZTogXCJQcm9ncmVzcyBCYXIgSG9sZGVyXCJcblx0XHRcdHBhcmVudDogQF9zdG9yaWVzQ29udGFpbmVyXG5cblx0XHQjIFNpbmdsZSBhdXRob3IncyBzdG9yaWVzIGhvbGRlciBjb25zdHJ1Y3Rpb25zXG5cblx0XHRAX2F1dGhvclN0b3J5SG9sZGVyID0gbmV3IExheWVyXG5cdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoICogQF9udW1iZXJPZlVwZGF0ZXNcblx0XHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdFx0bmFtZTogXCJBdXRoZXIncyBTdG9yaWVzIEhvbGRlclwiXG5cdFx0XHRwYXJlbnQ6IEBfc3Rvcmllc0NvbnRhaW5lclxuXHRcdEBfYXV0aG9yU3RvcnlIb2xkZXIucGxhY2VCZWhpbmQoQF9wcm9ncmVzc0JhckhvbGRlcilcblx0XHRhdXRob3JTdG9yeUhvbGRlciA9IEBfYXV0aG9yU3RvcnlIb2xkZXJcblxuXHRcdHByb2dyZXNzQmFySG9sZGVySW5pdGlhbFdpZHRoID0gQF9wcm9ncmVzc0JhckhvbGRlckluaXRpYWxXaWR0aFxuXHRcdHByb2dyZXNzQmFySG9sZGVyRm9yTG9vcCA9IEBfcHJvZ3Jlc3NCYXJIb2xkZXJcblx0XHRwcm9ncmVzc0JhckhvbGRlckluaXRpYWxTZWN0aW9uV2lkdGhGb3JMb29wID0gQF9wcm9ncmVzc0JhckhvbGRlckluaXRpYWxTZWN0aW9uV2lkdGhcblxuXHRcdCMgR2VuZXJhdGUgcHJvZ3Jlc3MgYW5kIGRldGVybWluZSBjdXJyZW50IHN0b3J5IHBvc2l0aW9uIGZvciBhdXRob3Jcblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyLm9uQ2hhbmdlIFwid2lkdGhcIiwgLT5cblx0XHRcdGF1dGhvclByb2dyZXNzID0gVXRpbHMubW9kdWxhdGUodGhpcy53aWR0aCwgWzAsIHByb2dyZXNzQmFySG9sZGVySW5pdGlhbFdpZHRoXSwgWzAsIDFdKVxuXHRcdFx0Zm9yIG51bWJlciBpbiBbMC4uLm51bWJlck9mVXBkYXRlc11cblx0XHRcdFx0aWYgKCAoIHByb2dyZXNzQmFySG9sZGVyRm9yTG9vcC53aWR0aCA8ICggcHJvZ3Jlc3NCYXJIb2xkZXJJbml0aWFsV2lkdGggKiAoIG51bWJlciArIDEgKSApICkgJiYgKCBwcm9ncmVzc0JhckhvbGRlckZvckxvb3Aud2lkdGggPiAoIHByb2dyZXNzQmFySG9sZGVySW5pdGlhbFNlY3Rpb25XaWR0aEZvckxvb3AgKiAoIG51bWJlciApICkgKSApXG5cdFx0XHRcdFx0Y3VycmVudFN0b3J5T2ZBdXRob3IgPSBudW1iZXIgKyAxXG5cdFx0XHRcdFx0YXV0aG9yU3RvcnlIb2xkZXIueCA9ICggLSBTY3JlZW4ud2lkdGggKiBudW1iZXIgKVxuXG5cdFx0IyBHZW5lcmF0ZSBzdG9yaWVzIGFuZCBwcm9ncmVzcyBiYXIgc2VjdGlvbnNcblxuXHRcdGlmICggQF9udW1iZXJPZlVwZGF0ZXMgPiAxIClcblx0XHRcdCMgRm9yIG1vcmUgdGhhbiBvbmUgdXBkYXRlIGNyZWF0ZSBzZWdtZW50cyBhbmQgc3BhY2UgZXZlbmx5XG5cdFx0XHRudW1iZXJPZlVwZGF0ZXMgPSBAX251bWJlck9mVXBkYXRlc1xuXHRcdFx0Zm9yIG51bWJlciBpbiBbMC4uLm51bWJlck9mVXBkYXRlc11cblx0XHRcdFx0QF9zdG9yeSA9IG5ldyBMYXllclxuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogVXRpbHMucmFuZG9tQ29sb3IoKVxuXHRcdFx0XHRcdGltYWdlOiBAb3B0aW9ucy5zdG9yaWVzW251bWJlcl1cblx0XHRcdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0XHRcdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0XHRcdFx0eDogU2NyZWVuLndpZHRoICogbnVtYmVyXG5cdFx0XHRcdFx0cGFyZW50OiBAX2F1dGhvclN0b3J5SG9sZGVyXG5cdFx0XHRcdEBfc3RvcnkubmFtZSA9IFwiU3RvcnkgXCIgKyAoIG51bWJlciArIDEgKVxuXHRcdFx0XHRAX3Byb2dyZXNzQmFyU2VjdGlvbiA9IG5ldyBMYXllclxuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmZmZmXCJcblx0XHRcdFx0XHRoZWlnaHQ6IEBvcHRpb25zLnByb2dyZXNzQmFySGVpZ2h0XG5cdFx0XHRcdFx0d2lkdGg6IChAX3Byb2dyZXNzQmFySG9sZGVyLndpZHRoLUBvcHRpb25zLnByb2dyZXNzQmFySG9yaXpvbnRhbFBhZGRpbmcpIC8gKCBAX251bWJlck9mVXBkYXRlcyApXG5cdFx0XHRcdFx0eDogbnVtYmVyICogKCAoIEBfcHJvZ3Jlc3NCYXJIb2xkZXIud2lkdGggLyBAX251bWJlck9mVXBkYXRlcyApICsgKCAoIEBvcHRpb25zLnByb2dyZXNzQmFySG9yaXpvbnRhbFBhZGRpbmcgLyAyICkgLyBAX251bWJlck9mVXBkYXRlcyApIClcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6IEBvcHRpb25zLnByb2dyZXNzQmFySGVpZ2h0XG5cdFx0XHRcdFx0cGFyZW50OiBAX3Byb2dyZXNzQmFySG9sZGVyXG5cdFx0XHRcdEBfcHJvZ3Jlc3NCYXJTZWN0aW9uLm5hbWUgPSBcIlByb2dyZXNzIEJhciBTZWN0aW9uIFwiICsgbnVtYmVyXG5cdFx0ZWxzZVxuXHRcdFx0IyBGb3Igb25lIHVwZGF0ZSBjcmVhdGUgZnVsbCB3aWR0aCBzZWdtZW50XG5cdFx0XHRAX3N0b3J5MSA9IG5ldyBMYXllclxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFV0aWxzLnJhbmRvbUNvbG9yKClcblx0XHRcdFx0aW1hZ2U6IEBvcHRpb25zLnN0b3JpZXNbMF1cblx0XHRcdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRcdFx0eDogMFxuXHRcdFx0XHRwYXJlbnQ6IEBfYXV0aG9yU3RvcnlIb2xkZXJcblx0XHRcdFx0bmFtZTogXCJTdG9yeVwiXG5cdFx0XHRAX3Byb2dyZXNzQmFyU2VjdGlvbjEgPSBuZXcgTGF5ZXJcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZmZmZcIlxuXHRcdFx0XHRoZWlnaHQ6IEBvcHRpb25zLnByb2dyZXNzQmFySGVpZ2h0XG5cdFx0XHRcdHdpZHRoOiBAX3Byb2dyZXNzQmFySG9sZGVyLndpZHRoXG5cdFx0XHRcdHg6IEFsaWduLmxlZnRcblx0XHRcdFx0Ym9yZGVyUmFkaXVzOiBAb3B0aW9ucy5wcm9ncmVzc0JhckhlaWdodFxuXHRcdFx0XHRwYXJlbnQ6IEBfcHJvZ3Jlc3NCYXJIb2xkZXJcblxuXHRcdCMgQ3JlYXRlIGR1cGxpY2F0ZSBwcm9ncmVzcyBiYXIgYW5kIG9wdGlvbmFsIGdyYWRpZW50IGZvciBiYWNrZ3JvdW5kXG5cblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyQkcgPSBAX3Byb2dyZXNzQmFySG9sZGVyLmNvcHkoKVxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJCRy5uYW1lID0gXCJQcm9ncmVzcyBCYXIgSG9sZGVyIEJhY2tncm91bmRcIlxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJCRy5vcGFjaXR5ID0gMC4yNVxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJCRy5wYXJlbnQgPSBAX3N0b3JpZXNDb250YWluZXJcblxuXHRcdGlmICggQG9wdGlvbnMucHJvZ3Jlc3NCYXJHcmFkaWVudCA9PSB0cnVlIClcblx0XHRcdEBfcHJvZ3Jlc3NCYXJCYWNrZ3JvdW5kR3JhZGllbnQgPSBuZXcgTGF5ZXJcblx0XHRcdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdFx0XHRoZWlnaHQ6ICggQG9wdGlvbnMucHJvZ3Jlc3NCYXJWZXJ0aWNhbFBhZGRpbmcgKiAyICkgKyAoIEBvcHRpb25zLnByb2dyZXNzQmFySGVpZ2h0ICsgNCApXG5cdFx0XHRcdGdyYWRpZW50OlxuXHRcdFx0XHRcdHN0YXJ0OiBcInJnYmEoMCwwLDAsMClcIlxuXHRcdFx0XHRcdGVuZDogXCJyZ2JhKDAsMCwwLDAuMylcIlxuXHRcdFx0XHRuYW1lOiBcIlByb2dyZXNzIEJhciBHcmFkaWVudFwiXG5cdFx0XHRcdHBhcmVudDogQF9zdG9yaWVzQ29udGFpbmVyXG5cblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyQkcuYnJpbmdUb0Zyb250KClcblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyLmJyaW5nVG9Gcm9udCgpXG5cblx0XHQjIFByb2dyZXNzIGJhciBjbGlwcGluZyBmb3IgYW5pbWF0aW9uXG5cblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyLmNsaXAgPSB0cnVlXG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlci53aWR0aCA9IDBcblxuXHRcdCMgVG91Y2ggYWN0aW9uc1xuXG5cdFx0QF9uZXh0SGl0Lm9uVG91Y2hTdGFydCA9PlxuXHRcdFx0QF9zdG9wU3Rvcmllc1BsYXliYWNrKClcblxuXHRcdEBfYmFja0hpdC5vblRvdWNoU3RhcnQgPT5cblx0XHRcdEBfc3RvcFN0b3JpZXNQbGF5YmFjaygpXG5cblx0XHRAX25leHRIaXQucHJvZ3Jlc3NCYXJIb2xkZXIgPSBAX3Byb2dyZXNzQmFySG9sZGVyXG5cdFx0QF9uZXh0SGl0LnByb2dyZXNzQmFySG9sZGVyQkcgPSBAX3Byb2dyZXNzQmFySG9sZGVyQkdcblx0XHRAX25leHRIaXQubnVtYmVyT2ZVcGRhdGVzID0gQF9udW1iZXJPZlVwZGF0ZXNcblxuXHRcdEBfYmFja0hpdC5wcm9ncmVzc0JhckhvbGRlciA9IEBfcHJvZ3Jlc3NCYXJIb2xkZXJcblx0XHRAX2JhY2tIaXQucHJvZ3Jlc3NCYXJIb2xkZXJCRyA9IEBfcHJvZ3Jlc3NCYXJIb2xkZXJCR1xuXHRcdEBfYmFja0hpdC5udW1iZXJPZlVwZGF0ZXMgPSBAX251bWJlck9mVXBkYXRlc1xuXG5cdFx0QF9uZXh0SGl0Lm9uVG91Y2hFbmQgPT5cblx0XHRcdGlmIGxvbmdQcmVzcyA9PSBmYWxzZVxuXHRcdFx0XHRAX3Byb2dyZXNzQmFySG9sZGVyLndpZHRoID0gKCBAX3Byb2dyZXNzQmFySG9sZGVyQkcud2lkdGggLyBudW1iZXJPZlVwZGF0ZXMgKSAqICggY3VycmVudFN0b3J5T2ZBdXRob3IgKVxuXHRcdFx0XHRjdXJyZW50U3RvcnlPZkF1dGhvcisrXG5cdFx0XHRcdGlmIGN1cnJlbnRTdG9yeU9mQXV0aG9yID49IG51bWJlck9mVXBkYXRlc1xuXHRcdFx0XHRcdGN1cnJlbnRTdG9yeU9mQXV0aG9yID0gY3VycmVudFN0b3J5T2ZBdXRob3Jcblx0XHRcdFx0QF90b3RhbFRpbWUgPSAoICggbnVtYmVyT2ZVcGRhdGVzIC0gKCBjdXJyZW50U3RvcnlPZkF1dGhvciAtIDEgKSApICogdGltZVBlclN0b3J5IClcblx0XHRcdFx0QF9zdGFydFN0b3JpZXNQbGF5YmFjaygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBfc3RhcnRTdG9yaWVzUGxheWJhY2soKVxuXHRcdFx0XHRsb25nUHJlc3MgPSBmYWxzZVxuXG5cdFx0QF9iYWNrSGl0Lm9uVG91Y2hFbmQgPT5cblx0XHRcdGlmIGxvbmdQcmVzcyA9PSBmYWxzZVxuXHRcdFx0XHRpZiBjdXJyZW50U3RvcnlPZkF1dGhvciA+IDFcblx0XHRcdFx0XHRAX3Byb2dyZXNzQmFySG9sZGVyLndpZHRoID0gKCBAX3Byb2dyZXNzQmFySG9sZGVyQkcud2lkdGggLyBudW1iZXJPZlVwZGF0ZXMgKSAqICggY3VycmVudFN0b3J5T2ZBdXRob3IgLSAyIClcblx0XHRcdFx0Y3VycmVudFN0b3J5T2ZBdXRob3ItLVxuXHRcdFx0XHRpZiBjdXJyZW50U3RvcnlPZkF1dGhvciA8IDFcblx0XHRcdFx0XHRjdXJyZW50U3RvcnlPZkF1dGhvciA9IDFcblx0XHRcdFx0QF90b3RhbFRpbWUgPSAoICggbnVtYmVyT2ZVcGRhdGVzIC0gKCBjdXJyZW50U3RvcnlPZkF1dGhvciAtIDEgKSApICogdGltZVBlclN0b3J5IClcblx0XHRcdFx0QF9zdGFydFN0b3JpZXNQbGF5YmFjaygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBfc3RhcnRTdG9yaWVzUGxheWJhY2soKVxuXHRcdFx0XHRsb25nUHJlc3MgPSBmYWxzZVxuXG5cdFx0QF9uZXh0SGl0Lm9uTG9uZ1ByZXNzIC0+XG5cdFx0XHRsb25nUHJlc3MgPSB0cnVlXG5cblx0XHRAX2JhY2tIaXQub25Mb25nUHJlc3MgLT5cblx0XHRcdGxvbmdQcmVzcyA9IHRydWVcblxuXHRfc3RhcnRTdG9yaWVzUGxheWJhY2s6IC0+XG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlckFuaW1hdGlvbiA9IEBfcHJvZ3Jlc3NCYXJIb2xkZXIuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdFx0Y3VydmU6IEJlemllci5saW5lYXJcblx0XHRcdHRpbWU6IEBfdG90YWxUaW1lXG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlckFuaW1hdGlvbi5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCAoYW5pbWF0aW9uLCBsYXllcikgPT5cblx0XHRcdEBfZW5kT2ZVcGRhdGVzRXZlbnQueCA9IDFcblxuXHRfc3RvcFN0b3JpZXNQbGF5YmFjazogLT5cblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyQW5pbWF0aW9uLnN0b3AoKVxuXG5cdF9yZXNldFN0b3JpZXNQbGF5YmFjazogLT5cblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyQW5pbWF0aW9uLmZpbmlzaCgpXG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlckFuaW1hdGlvbi5yZXNldCgpIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIu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
