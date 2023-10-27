#include <Audio.h>
#include <Wire.h>
#include <SPI.h>
#include <SD.h>
#include <SerialFlash.h>

AudioSynthWaveform       waveform1;      //xy=169,142
AudioEffectFreeverb      freeverb1;      //xy=190,321
AudioSynthWaveformSineModulated sine_fm1;       //xy=339,149
AudioEffectDelay         delay1;         //xy=527,169
AudioMixer4              mixer1;         //xy=669,325
AudioOutputI2S           i2s1;           //xy=882,327
AudioConnection          patchCord1(waveform1, sine_fm1);
AudioConnection          patchCord2(freeverb1, 0, mixer1, 3);
AudioConnection          patchCord3(sine_fm1, freeverb1);
AudioConnection          patchCord4(sine_fm1, delay1);
AudioConnection          patchCord5(sine_fm1, 0, mixer1, 2);
AudioConnection          patchCord6(delay1, 0, mixer1, 0);
AudioConnection          patchCord7(delay1, 1, mixer1, 1);
AudioConnection          patchCord8(mixer1, 0, i2s1, 0);
AudioConnection          patchCord9(mixer1, 0, i2s1, 1);
AudioControlSGTL5000     sgtl5000_1;     //xy=853,268


#define LED_PIN 13
#define FLANGE_BUFFER_SIZE 256

void handleNoteOn(byte inChannel, byte inNote, byte inVelocity) {
  digitalWrite(LED_PIN, 0);
  float frequency = midiToFreq(inNote);
  sine_fm1.frequency(frequency);
  sine_fm1.amplitude(inVelocity/127.0); // velocity * 0.5 / 127.0
}

void handleNoteOff(byte inChannel, byte inNote, byte inVelocity) {
  digitalWrite(LED_PIN, 1);
  sine_fm1.amplitude(50);
}

void controlChange(byte channel, byte control, byte value) {
  if (channel == 1) {
    switch (control) {
      case 10:
        delay1.delay(0, value * 2.0);
        break;
      case 11:
        waveform1.pulseWidth(value / 127.0);
        break;
      case 12:
        sine_fm1.amplitude(value / 127.0); // add dbtoa(-value/3.0);
        break;
      case 13:
        delay1.delay(1, value * 1.5);
        break;
      case 66:
        analogWrite(LED_PIN, value / 2);
        break;
      default:
        break;
    }
  }
}

float midiToFreq(int midiNote) {
  return pow(2.0, (midiNote - 69) / 12.0) * 440.0;
}

float volume = 0.01;
int waveform_type = WAVEFORM_SINE;
int mixer1_setting = 0;
elapsedMillis timeout = 0;

void setup() {
  Serial.begin(9600);
  AudioMemory(160);

  sgtl5000_1.enable();
	sgtl5000_1.volume(0.8);

  waveform1.begin(WAVEFORM_SINE);
  waveform1.amplitude(0.75);
  waveform1.frequency(50);
  waveform1.pulseWidth(0.15);

  patchCord8.connect();

  mixer1.gain(0, volume);
  mixer1.gain(1, volume);

  sine_fm1.frequency(100);
  sine_fm1.amplitude(10);

  delay1.delay(0, 110);
  delay1.delay(1, 150);

  freeverb1.roomsize(0.5);
  freeverb1.damping(0.5);

  pinMode(LED_PIN, OUTPUT);

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

