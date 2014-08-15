angular.module('d12App')
  .factory('d12allPitches', ['d12Utils', 'minPitch', 'maxPitch', function (u, minPitch, maxPitch) {
    return u.range(minPitch, maxPitch + 1);
  }])

  .value('instrumentsData', [
    {
      midiName: 'acoustic_grand_piano',
      humanName: "Piano",
      soft: true,
      sustain: false
    },
    {
      midiName: 'acoustic_guitar_steel',
      humanName: "Folk Guitar",
      soft: true,
      sustain: false
    },
    {
      midiName: 'cello',
      humanName: "Cello",
      soft: true,
      sustain: true
    },
    {
      midiName: 'church_organ',
      humanName: "Church Organ",
      soft: false,
      sustain: true
    },
    {
      midiName: 'flute',
      humanName: "Flute",
      soft: true,
      sustain: true
    },
    {
      midiName: 'distortion_guitar',
      humanName: "Distorsion Guitar",
      soft: false,
      sustain: true
    },
    {
      midiName: 'soprano_sax',
      humanName: "Soprano Saxophone",
      soft: true,
      sustain: true
    }
  ])

  .factory('availableInstrumentsData', ['instrumentsData', 'availableInstruments', '$log',
    function (instrumentsData, availableInstruments, $log) {
      $log.debug("instrumentsData = ", instrumentsData);
      return instrumentsData.filter(function (insData) {
        return availableInstruments.isAvailable(insData.midiName);
      });
    }]);