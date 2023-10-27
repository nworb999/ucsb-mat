#include <Audio.h>
#include <Wire.h>
#include <SPI.h>
#include <SD.h>
#include <SerialFlash.h>

// GUItool: begin automatically generated code
AudioSynthWaveform       waveform1;      //xy=82,44
AudioSynthWaveformModulated waveformMod1;   //xy=203,135
AudioMixer4              mixer1;         //xy=423,133
AudioEffectDelay         delay1;         //xy=463,366
AudioFilterLadder        filter;        //xy=571,139
AudioAmplifier           amp1;           //xy=728,141
AudioOutputI2S           i2s1;           //xy=896,157
AudioConnection          patchCord1(waveform1, 0, waveformMod1, 0);
AudioConnection          patchCord2(waveformMod1, 0, mixer1, 0);
AudioConnection          patchCord3(mixer1, 0, filter, 0);
AudioConnection          patchCord4(delay1, 0, mixer1, 1);
AudioConnection          patchCord5(filter, delay1);
AudioConnection          patchCord6(filter, amp1);
AudioConnection          patchCord7(amp1, 0, i2s1, 0);
AudioConnection          patchCord8(amp1, 0, i2s1, 1);
AudioControlSGTL5000     sgtl5000_1;     //xy=895,70
// GUItool: end automatically generated code


void setup() {
  // put your setup code here, to run once:

}

void loop() {
  // put your main code here, to run repeatedly:

}
