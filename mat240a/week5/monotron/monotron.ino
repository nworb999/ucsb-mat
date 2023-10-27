#include <Audio.h>
#include <Wire.h>
#include <SPI.h>
#include <SD.h>
#include <SerialFlash.h>

// GUItool: begin automatically generated code
AudioSynthWaveform       LFO;      //xy=82,44
AudioSynthWaveformModulated VCO;   //xy=203,135
AudioMixer4              feedback;         //xy=423,133
AudioEffectDelay         delay1;         //xy=463,366
AudioFilterLadder        VCF;        //xy=571,139
AudioAmplifier           volume;           //xy=728,141
AudioOutputI2S           output;           //xy=896,157
AudioConnection          patchCord1(LFO, 0, VCO, 0);
AudioConnection          patchCord2(VCO, 0, feedback, 0);
AudioConnection          patchCord3(feedback, 0, VCF, 0);
AudioConnection          patchCord4(delay1, 0, feedback, 1);
AudioConnection          patchCord5(VCF, delay1);
AudioConnection          patchCord6(VCF, volume);
AudioConnection          patchCord7(volume, 0, output, 0);
AudioConnection          patchCord8(volume, 0, output, 1);
AudioControlSGTL5000     sgtl5000_1;     //xy=895,70
// GUItool: end automatically generated code


void setup() {
  // put your setup code here, to run once:

}

void loop() {
  // put your main code here, to run repeatedly:

}
