#include <Audio.h>
#include <Bounce.h>
#include <Wire.h>
#include <SPI.h>
#include <SD.h>
#include <SerialFlash.h>

AudioSynthWaveformSineModulated sine_fm1;
AudioSynthWaveform waveform1;              
AudioEffectFreeverb freeverb1;             
AudioMixer4 mixer1;                       
AudioEffectDelay delay1;                   

AudioOutputI2S i2s1;                      
AudioControlSGTL5000 sgtl5000_1;

AudioConnection patchCord1(sine_fm1, freeverb1);
AudioConnection patchCord3(freeverb1, 0, mixer1, 1);
AudioConnection patchCord4(sine_fm1, 0, mixer1, 0);
AudioConnection patchCord5(mixer1, delay1);
AudioConnection patchCord6(delay1, 0, i2s1, 0);
AudioConnection patchCord7(delay1, 1, i2s1, 1);
AudioConnection patchCord8(waveform1, 0, sine_fm1, 1);

#define LED_PIN 13
#define FLANGE_BUFFER_SIZE 256

void handleNoteOn(byte inChannel, byte inNote, byte inVelocity) {
  digitalWrite(LED_PIN, 0);
  float frequency = midiToFreq(inNote);
  sine_fm1.frequency(frequency);
  sine_fm1.amplitude(inVelocity/127.0);
}

void handleNoteOff(byte inChannel, byte inNote, byte inVelocity) {
  digitalWrite(LED_PIN, 1);
  sine_fm1.amplitude(0);
}

void controlChange(byte channel, byte control, byte value) {
  if (channel == 1) {
    switch (control) {
      case 10:
        delay1.delay(0, 330);
        break;
      case 11:
        waveform1.pulseWidth(value / 127.0);
        break;
      case 12:
        waveform1.amplitude(value / 127.0);
        break;
      case 13:
        delay1.delay(1, 330);
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

  pinMode(LED_PIN, OUTPUT);
  usbMIDI.setHandleNoteOff(handleNoteOff);
  usbMIDI.setHandleNoteOn(handleNoteOn);
  usbMIDI.setHandleControlChange(controlChange);

  digitalWrite(LED_BUILTIN, HIGH);
  delay(400);                 // Blink LED once at startup
  digitalWrite(LED_BUILTIN, LOW);
}

void loop() {
  while (usbMIDI.read()) {
  }
}

