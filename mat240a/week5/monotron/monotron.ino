#include <Audio.h>
#include <Wire.h>
#include <SPI.h>
#include <SD.h>
#include <SerialFlash.h>

// GUItool: begin automatically generated code
AudioSynthWaveform LFO;           //xy=82,44
AudioSynthWaveformModulated VCO;  //xy=203,135
AudioMixer4 feedback;             //xy=423,133
AudioEffectDelay delay1;          //xy=463,366
AudioFilterLadder VCF;            //xy=571,139
AudioAmplifier volume;            //xy=728,141
AudioOutputI2S output;            //xy=896,157
AudioConnection patchCord1(LFO, 0, VCO, 0);
AudioConnection patchCord2(VCO, 0, feedback, 0);
AudioConnection patchCord3(feedback, 0, VCF, 0);
AudioConnection patchCord4(delay1, 0, feedback, 1);
AudioConnection patchCord5(VCF, delay1);
AudioConnection patchCord6(VCF, volume);
AudioConnection patchCord7(volume, 0, output, 0);
AudioConnection patchCord8(volume, 0, output, 1);
AudioControlSGTL5000 sgtl5000_1;  //xy=895,70
// GUItool: end automatically generated code

#define LED_PIN 13

float midiToFreq(int midiNote) {
  return pow(2.0, (midiNote - 69) / 12.0) * 440.0;
}

float dbtoa(float db) {
  return pow(10.0, db / 20.0);
}

void handleNoteOn(byte inChannel, byte inNote, byte inVelocity) {
  digitalWrite(LED_PIN, HIGH);
  float frequency = midiToFreq(inNote);
  VCO.frequency(frequency);
  VCO.amplitude(inVelocity / 127.0);
}

void handleNoteOff(byte inChannel, byte inNote, byte inVelocity) {
  digitalWrite(LED_PIN, LOW);
  VCO.amplitude(50);
}

void controlChange(byte channel, byte control, byte value) {
  if (channel == 1) {
    switch (control) {
      case 1:  // INT. knob
        LFO.amplitude(dbtoa(map(value & 127, 0, 127, -55, 0)));
        break;
      case 2:  // RATE knob
        LFO.frequency(midiToFreq(value));
        break;
      case 3:  // CUTOFF knob
        VCF.frequency(midiToFreq(value));
        break;
      case 4:  // RESONANCE knob
        VCF.resonance(midiToFreq(value));
        break;
      case 5:  // DELAY time
        delay1.delay(1, value * 1.5);
        break;
      case 6:  // DELAY feedback
               // can i create it?
        break;
      case 7:  // GAIN
        volume.gain(map(value, 0, 127, 0, 2));
        break;
      default:
        break;
    }
  }
}

float startVolume = 0.01;
int default_waveform = WAVEFORM_SINE;



void setup() {
  Serial.begin(9600);
  AudioMemory(160);

  sgtl5000_1.enable();
  sgtl5000_1.volume(0.8);

  volume.gain(startVolume);

  VCO.begin(default_waveform);
  VCO.frequency(100);
  VCO.amplitude(10);

  pinMode(LED_PIN, OUTPUT);

  usbMIDI.begin();

  usbMIDI.setHandleNoteOff(handleNoteOff);
  usbMIDI.setHandleNoteOn(handleNoteOn);
  usbMIDI.setHandleControlChange(controlChange);

  // Blink LED once at startup
  digitalWrite(LED_BUILTIN, HIGH);
  delay(400);
  digitalWrite(LED_BUILTIN, LOW);
}

void loop() {
  while (usbMIDI.read()) {
  }
}
