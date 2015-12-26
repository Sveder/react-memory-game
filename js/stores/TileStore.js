var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TileConstants = require('../constants/TileConstants');
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';


var _tiles = [];

var _texts = {"1" : "עדה יונת - כלת פרס נובל לכימיה  (2009)",
              "2" : "אנה טיכו - ציירת ישראלית כלת פרס ישראל",
              "3" : "מלאלה יוספזאי - פעילה מגיל 11 למען זכותן של בנות בפקיסטאן לחינוך. כלת פרס נובל (2014)",
              "4" : "שרה לוי תנאי-מייסדת להקת ענבל כלת פרס ישראל למחול. כתבה את השיר 'באנו חושך לגרש' ו'ליצן קטן שלי'",
              "5" : "הלן קלר-פעילה חברתית נואמת עולמית וסופרת. מגיל צעיר נודעה בשל התמודדותה הייחודית בהיותה חרשת ועיוורת.",
              "6" : "הנרייטה סאלד-אשת חינוך ממייסדות הדסה עמדה בראש ארגון עליית הנוער לזכרה נקבע התאריך בו נחגג יום המשפחה.",
              "7" : "סאלי רייד-האסטרונאוטית האמריקאית הראשונה",
              "8" : "מרים נאור -נשיאת בית המשפט העליון"};

function generateTiles() {
    var images = [];
    for (var i = 1; i < 9; i++) {
        images.push("images/__" + i + "a.jpg");
        images.push("images/__" + i + "b.jpg");
    }
    images = _.shuffle(images); 

    var descs = [];
    for (var i = 0; i < images.length; i++) {
        _tiles.push({
            image: images[i],
            flipped: false,
            matched: false
        });
    }
}

function clickTile(targetId) {
    /**
     * Flip the tile
     */
    _tiles[targetId].flipped = true;


}

function matchCheck() {
    var flipped = [];

    /**
     * Check if there is any matching tile
     */

    for (var id in _tiles) {

        if (_tiles[id].flipped === true && _tiles[id].matched === false) {
            flipped.push(id);
        }

    }

    if (flipped.length < 2) return;
    
    regex = /images\/__(.+)[ab]\.jpg/;
    first = regex.exec(_tiles[flipped[0]].image);
    second = regex.exec(_tiles[flipped[1]].image); 

    if (first[1] == second[1]) {
        _tiles[flipped[0]].matched = true;

        _tiles[flipped[1]].matched = true;


    } else {
        _tiles[flipped[0]].flipped = false;

        _tiles[flipped[1]].flipped = false;

    }
}
var TileStore = assign({}, EventEmitter.prototype, {


    /**
     * Get the entire collection of TODOs.
     * @return {object}
     */
    getAll: function () {
        return _tiles;
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    getFirstFlipIndex: function () {

        var firstFlipIndex = null;

        for (var id in _tiles) {
            if (_tiles[id].flipped === true && _tiles[id].matched === false) {
                firstFlipIndex = id;
            }
        }

        return firstFlipIndex;
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Register callback to handle all updates
TileStore.dispatchToken = AppDispatcher.register(function (action) {

    switch (action.actionType) {
        case TileConstants.TILE_CLICK:
            clickTile(action.id);
            TileStore.emitChange();
            break;

        case TileConstants.MATCH_CHECK:
            matchCheck();
            TileStore.emitChange();

            break;
        default:
        // no op
    }
});

generateTiles();


/**
 * When a tile is clicked
 */

module.exports = TileStore;
