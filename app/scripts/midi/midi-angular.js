(function () {

  /**
   * Data structure for a set of nonempty strings backed by a linked-list to remember last added elements.
   * @param elements
   * @returns an object exposing standard collection methods (all detachable).
   */
  function linkedSet(elements) {

    var res = {};

    var count = 0;

    var emptyCell = {
      s: true
    };
    emptyCell.l = emptyCell;
    emptyCell.r = emptyCell;

    function leftMostCell() {
      return emptyCell.r;
    }

    function rightMostCell() {
      return emptyCell.l
    }

    function removeCell(cell) {
      var leftCell = cell.l, rightCell = cell.r;
      leftCell.r = rightCell;
      rightCell.l = leftCell;
    }

    function insertRightTo(leftCell, elem) {
      var rightCell = leftCell.r;
      var newCell = {
        l: leftCell, r: rightCell,
        e: elem
      };
      leftCell.r = newCell;
      rightCell.l = newCell;
      positions[elem] = newCell;

      count += 1;
    }

    var positions = {};

    function remove(elem) {
      if (positions[elem]) {
        removeCell(positions[elem]);
        delete positions[elem];
        count -= 1;
        return true;
      }
      return false;
    }

    function size() {
      return count;
    }

    function isEmpty() {
      return count === 0;
    }

    function contains(elem) {
      return (positions[elem] ? true : false);
    }


    function addFirst(elem) {
      remove(elem);
      insertRightTo(emptyCell, elem);
      return res;
    }

    function addLast(elem) {
      remove(elem);
      insertRightTo(emptyCell.l, elem);
      return res;
    }

    function popFirst() {
      if (!isEmpty()) {
        var elem = leftMostCell().e;
        remove(elem);
        return elem;
      }
    }

    function popLast() {
      if (!isEmpty()) {
        var elem = rightMostCell().e;
        remove(elem);
        return elem;
      }
    }

    function peekFirst() {
      return leftMostCell().e;
    }

    function peekLast() {
      return rightMostCell().e;
    }

    function toArray() {
      var arr = [];
      var cell = leftMostCell();
      while (!cell.s) {
        arr.push(cell.e);
        cell = cell.r;
      }
      return arr;
    }

    if (elements) {
      elements.forEach(addLast);
    }

    res.isEmpty = isEmpty;
    res.size = size;
    res.contains = contains;
    res.remove = remove;

    res.addFirst = addFirst;
    res.addLast = addLast;

    res.popFirst = popFirst;
    res.popLast = popLast;

    res.peekFirst = peekFirst;
    res.peekLast = peekLast;

    res.toArray = toArray;

    return res;
  }


  angular.module('duodesicalMIDI', ['d12calToolbox'])

    // number of available MIDI channels.
    .constant('channelsCount', 16)

    // default loaded instruments.
    .constant('availableInstruments', [
      "acoustic_grand_piano",
      'acoustic_guitar_steel',
      'cello',
      'church_organ',
      'distortion_guitar',
      'flute',
      'soprano_sax'
      //,'acoustic_guitar_nylon',
      //'banjo',
      //'clarinet',
      //'contrabass',
      //'electric_bass_finger',
      //'electric_guitar_clean',
      //'overdriven_guitar',
      //'string_ensemble_1',
      //'synth_drum',
      //'trumpet',
      //'violin'
    ])

    .factory('MIDI', ['$window','$log', function ($window,$log) {
      if(angular.isDefined($window.MIDI)){
        var MIDI = $window.MIDI;
        $log.debug("Found MIDI.js global object : ", MIDI);
        return MIDI;
      } else {
        $log.error("MIDI.js global object not found.");
      }
    }])

    .value('minPitch',21)
    .value('maxPitch',108)

    .value('defaultNoteOptions',{
      instrument: 'acoustic_guitar_steel',
      pitch: 48,
      delay: 0,
      duration: 1.0,
      velocity: 127
    })

    .factory('instruPlayer', ['$q', '$log', 'd12Utils', 'channelsCount', 'availableInstruments','MIDI','timeUtils','defaultNoteOptions','$timeout',
      function ($q, $log, u, channelsCount, availableInstruments, MIDI, timeUtils, defaultNoteOptions, $timeout) {

        var midijsInstrumentByName = MIDI.GeneralMIDI.byName;
        function programNumberFor(instrumentName) {
          return midijsInstrumentByName[instrumentName].number;
        }

        /**
         * Array mapping each channel number to an instrument name.
         * Initially set to channelsCount `null` instruments.
         */
        var channelsConfig = u.constant_array(channelsCount, null);
        var channelOfInstrument = {};

        function setChannelToInstrument(channelNumber, instrumentName) {
          if (channelsConfig[channelNumber]) {
            delete channelOfInstrument[channelsConfig[channelNumber]]; //removing instrument
          }
          channelsConfig[channelNumber] = instrumentName;
          channelOfInstrument[instrumentName] = channelNumber;
          MIDI.programChange(channelNumber, programNumberFor(instrumentName));
        }

        var availableChannelsNumbers = u.range(channelsCount);
        var instrumentsSet = linkedSet([]);

        var hasInstrument = instrumentsSet.contains;

        function addInstrument(instrumentName) {
          if(!hasInstrument(instrumentName)){
            var channelNumber;
            if(availableChannelsNumbers.length > 0){
              channelNumber = availableChannelsNumbers.pop();
            } else {
              // no more available channels : pop out the oldest instrument and free channel.
              var oldestInstrument = instrumentsSet.popFirst();
              channelNumber = channelOfInstrument[oldestInstrument];
            }
            setChannelToInstrument(channelNumber,instrumentName);
          }
          // make it most recent instrument
          instrumentsSet.addLast(instrumentName);
        }
        function removeInstrument(instrumentName) {
          if(hasInstrument(instrumentName)){
            var channelNumber = channelOfInstrument[instrumentName];
            delete channelOfInstrument[instrumentName];
            channelsConfig[channelNumber] = null;

            availableChannelsNumbers.push(channelNumber);
            instrumentsSet.remove(instrumentName);
          }
        }

        function loadInstruments(instrumentNames) {
          $log.debug("Loading instrument : ", instrumentNames, "...");

          var deferredMidi = $q.defer();
          MIDI.loadPlugin({
            soundfontUrl: 'scripts/midi/soundfonts/',
            instruments: instrumentNames,
            callback: function () {
              $log.debug("Done loading instrument : ", instrumentNames, "...");
              $log.debug(MIDI);
              deferredMidi.resolve(MIDI);
            }
          });

          return deferredMidi.promise;
        }

        var loadedMidi = loadInstruments(availableInstruments);
        loadedMidi.then(function () {
          availableInstruments.forEach(addInstrument);
          $log.debug("Channels config : ", channelsConfig);
          $log.debug("Channels of instrument : ", channelOfInstrument);
        });

        function noteOn(instrumentName, pitch, delay, velocity) {
          delay = (delay || 0);
          velocity = (velocity || 127);

          addInstrument(instrumentName);

          var channelNumber = channelOfInstrument[instrumentName];
          MIDI.noteOn(channelNumber,pitch,velocity,delay);
        }
        function noteOff(instrumentName, pitch, delay) {
          MIDI.noteOff(channelOfInstrument[instrumentName],pitch,delay);
        }

        function playNote (noteOptions,withReceipt,invokeApply){
          var onDelay = (noteOptions.delay || defaultNoteOptions.delay),
            offDelay=(noteOptions.delay || defaultNoteOptions.delay) + (noteOptions.duration || defaultNoteOptions.duration);
          noteOn(
            (noteOptions.instrument || defaultNoteOptions.instrument),
            (noteOptions.pitch || defaultNoteOptions.pitch),
            onDelay,
            (noteOptions.velocity || defaultNoteOptions.velocity)
          );
          noteOff(
            (noteOptions.instrument || defaultNoteOptions.instrument),
            (noteOptions.pitch || defaultNoteOptions.pitch),
            offDelay
          );
          if(withReceipt){
            var triggeredAt= timeUtils.nowMillis();
            return {
              triggeredAt: triggeredAt,
              opts: noteOptions,
              on: $timeout(function () {
                return {
                  elapsed: (timeUtils.nowMillis() - triggeredAt)
                };
              }, onDelay * 1000, !!invokeApply),
              off: $timeout(function () {
                return {
                  elapsed: (timeUtils.nowMillis() - triggeredAt)
                };
              }, offDelay * 1000, !!invokeApply)
            };
          }
        }

        var millisUntil = timeUtils.millisUntil;
        function playNoteAt(instrumentName, pitch, duration, dateMillis, velocity){
          var delay = millisUntil(dateMillis);
          playNote(instrumentName,pitch,duration,delay,velocity);
        }

        return {
          availableInstruments: availableInstruments,
          loadedMidi: loadedMidi,
          addInstrument: addInstrument,
          removeInstrument: removeInstrument,
          getCurrentInstruments: instrumentsSet.toArray,
          noteOn: noteOn,
          noteOff: noteOff,
          playNote: playNote,
          playNoteAt: playNoteAt
        };

      }]);

}());