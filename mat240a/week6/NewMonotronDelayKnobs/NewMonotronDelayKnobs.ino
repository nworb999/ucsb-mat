// Karl Yerkes ~ 2023-10-27
// MAT 240A ~ Audio Programming
//
// This sketch implements the Korg Monotron Delay incompletely.
// Finish the sketch so that each important control is given
// a knob/CC. See the comments in the code for guidance as to
// where you should add or change code. 
#include <Audio.h>
#include <Wire.h>
#include <SPI.h>
#include <SD.h>
#include <SerialFlash.h>

// GUItool: begin automatically generated code
AudioSynthWaveformDc     offset;            //xy=69,394
AudioSynthWaveform       LFO;      //xy=73,213
AudioSynthWaveformDc     pitch;            //xy=112,145
AudioMixer4              mixer2;         //xy=174,315
AudioSynthWaveformModulated VCO;   //xy=246,220
AudioMixer4              feedback;         //xy=410,239
AudioEffectDelay         delay1;         //xy=451,488
AudioFilterLadder        VCF;        //xy=554,251
AudioAmplifier           volume;           //xy=701,251
AudioOutputI2S           output;           //xy=856,258
AudioConnection          patchCord1(offset, 0, mixer2, 1);
AudioConnection          patchCord2(LFO, 0, mixer2, 0);
AudioConnection          patchCord3(pitch, 0, VCO, 0);
AudioConnection          patchCord4(VCO, 0, feedback, 0);
AudioConnection          patchCord5(feedback, 0, VCF, 0);
AudioConnection          patchCord6(delay1, 0, feedback, 1);
AudioConnection          patchCord7(VCF, delay1);
AudioConnection          patchCord8(VCF, volume);
AudioConnection          patchCord9(volume, 0, output, 0);
AudioConnection          patchCord10(volume, 0, output, 1);
AudioControlSGTL5000     sgtl5000_1;     //xy=861,206
// GUItool: end automatically generated code


class AudioEffectOnePole : public AudioStream {
  audio_block_t *inputQueueArray[1];
  float y1{0};
  float a{0}, b{1}; // bypass condition
public:
  AudioEffectOnePole() : AudioStream(1, inputQueueArray) {}
  
        virtual void update(void) {
          audio_block_t *input = receiveReadOnly(0);
          audio_block_t *output = allocate();
          // !
          for (int i = 0; i < AUDIO_BLOCK_SAMPLES; ++i) {
            float x = input->data[i] / 32767;
            y1 = a * y1 + b * x; // float (-1, 1)
            output->data[i] = y1 * 32767;
          }
          // !
          transmit(output, 0);
          release(output);
          release(input);

        }

        void frequency(float hz) {
          b = exp(-2.0 * M_PI * hz);
          a = 1.0 - b;
        }
};


float mtof(float midi) {
  return 440.0 * pow(2.0, (midi - 69.0) / 12.0);
}

float dbtoa(float db) {
  return pow(10.0, db / 20.0);
}

void handleNoteOn(byte inChannel, byte inNote, byte inVelocity) {
  digitalWrite(13, HIGH);

  // add note on code here
}

void handleNoteOff(byte inChannel, byte inNote, byte inVelocity) {
  digitalWrite(13, LOW);

   // add note off code here
}

void controlChange(byte channel, byte control, byte value) {

  static int v = 0;

  switch (control) {

    // Extended (14-bit) Control Change messages
    //
    // The most significant 7 bits come in on the first byte.
    // Then the least significant bits come in on another CC
    // number (add 32 to the CC number to get the second
    // byte).
    //
    case 1:  // CC #1 MSB
      v = 0;
      v += (127 & value) << 7;
      break;
    case 33:  // CC #1 LSB
      v += 127 & value;
      LFO.amplitude(v / 16383.0); // INT. knob
      break;

    case 2:  // CC #2 MSB
      v = 0;
      v += (127 & value) << 7;
      break;
    case 34:  // CC #2 LSB
      v += 127 & value;
      LFO.frequency(mtof(map(v, 0.0, 16383.0, -50, 40))); // RATE knob
      break;

    // Normal (7-bit) Control Change messages
    //
    case 3: // CC #3
      // add some knob
      break;
    case 4: // CC #4
      // add some knob
      break;

    // add more knobs here

    // add TIME knob controlling delay time. You have
    // to increase AudioMemory for more delay. See the 
    // documentation for AudioEffectDelay.

    default:
      break;
  }
}


void setup() {
  usbMIDI.setHandleNoteOff(handleNoteOff);
  usbMIDI.setHandleNoteOn(handleNoteOn);
  usbMIDI.setHandleControlChange(controlChange);
  Serial.begin(9600);

  // You will need to change the amount of audio memory at some point.
  // Calculate the number based on the maximum delay you need. See the
  // documentation on delay.
  //
  AudioMemory(20);
  sgtl5000_1.enable();
  sgtl5000_1.volume(0.707);

  // These settings are designed for testing. They set up the synth so there
  // is zero feedback-delay and the synth is playing a note forever while the
  // LFO is modulating the VCO. You will change these settings once you
  // finish adding all the knobs/CCs to this sketch. When the synth boots up
  // it should be silent with well-considered defaults. Also, ideally, when
  // the synth boots up, it should send a message to Max requesting the
  // current settings (CC values) and Max should send all the settings when
  // it receives that message. In this way, a physical UI is imitated.
  //
  volume.gain(1.0); // VOLUME knob; add this knob/CC
  VCF.frequency(15000); // CUTOFF knob; add this knob/CC
  VCF.resonance(0); // add a knob/CC for this; Monotron Delay does not have this
  feedback.gain(0, 1.0); // pass VCO signal
  feedback.gain(3, 0.0); // FEEDBACK knob; add this knob/CC
  VCO.begin(1.0, 440.0, WAVEFORM_BANDLIMIT_SAWTOOTH);
  LFO.begin(0.5, 1.0, WAVEFORM_BANDLIMIT_PULSE); // also WAVEFORM_TRIANGLE
  LFO.pulseWidth(0.5); // add a knob//CC for this; Monotron Delay does not have this
  mixer2.gain(0, 0.0);
  mixer2.gain(1, 1.0);
  VCO.frequencyModulation(2.0);
}

inline float kymap(float value, float low, float high, float Low, float High) {
  return Low + (High - Low) * ((value - low) / (high - low));
}

void loop() {
  while (usbMIDI.read());

  VCF.frequency(mtof(map(analogRead(A17), 0, 1023, 0.0, 127.0)));
  LFO.frequency(mtof(map(analogRead(A14), 0, 1023, -50.0, 40.)));
  LFO.amplitude(dbtoa(map(analogRead(A15), 0, 1023, -65.0, 0.0 + dbtoa(-65.0)) - dbtoa(-65.0)));
  //offset.amplitude(map(analogRead(A10), 0, 1023, -1.0, 1.0));
  //LFO.amplitude(0);
  LFO.offset(map(analogRead(A16), 0, 1023, -0.5, 0.5));


  //VCO.frequency(mtof(map(analogRead(A10), 0, 1023, 0.0, 127.0)));
  //static float last = 0;
  /*
  if (abs(f - last) < 0.013) {
    f = last; // ignore value that is not that different 
  }
  last = f;
  pitch.amplitude(f, 2);
*/
  //Serial.println(f, 5);
  delay(2);
  //
}

/*
<pre><code>
----------begin_max5_patcher----------
962.3ocyXE0iSiCD941eEV4k6No1RrSRaVdBDbHs5DuAObBVgbSlcqoI18rc
VZEB9syX6D1tPWRutYE6CMtYxX+4uY97Xm74wihVp1BlHxSIuiLZzmGOZj2j
yvn16GEUy2VTwMd2hJT00fzFMI7LKr05s+2asfrDJI+IMc5Rg8uHu3EjZvX3
WAcNugaKVIjW8AMTXCfNe9r3IDVxY9FZhuIdVL4h19HapExJv5QmdiQUisyZ
bqUQoelnV9woz4QNaeY7X2kI+N4VRx7gkamMjT6MqDFhetSv+vInea3RgRRr
JhcEPdttrQHUDyZv4jcE2RD0ap.2vY7t7ZkTY0XWdITw2Mib6wDeleTQFAyH
uRoI.GexZoZ4Svv3NUCgWV9ivUnJgI9Gv8tRVAZzfad4PjukXDkfqWEJIBdk
29a.PZ1QL6j1UyHmaI0hqVYw9Vsw4ZX3pDVL75GCOaLv+0.xBvPJVwkWgsFk
eZUpj+A1Y90dbZLXiiYu87.CrhZv6mEL3nnpAqS.LiLcJ4e35Jx+B503n8UL
oyRlRimxVzE+qDRnP0H8Igr6VBQoNQS3ZZpWHsH8dqfROEEjD9D12eR.UKJE
HZj2G0F7e84u77m77Fz56ih5iYIyi8DLzvX2+E9zSga0MUVgoBUT5torRKPA
N2hKE1Gp6jIr7EgTUVHYsnOp3zskbK+toGq0pArX+wIb.u1HVR99Bg8BAr3a
B6ZNpJA8G.IeYErOQB3X2sABiJlqvejKFNkw1BakSYv5WEDJQlk7qEAIGLJQ
OPDfFcWrT3VxcwiE4Oadx.K+i+MI+omE+HQ9m+3R8S6WDDN7yfo9WL7h+RAu
p+UwtLBl5i6t9+QKe.dPSOoL4kUJ9vtFuMSlRdlDmFm3R8TV3XfwYmRZ9PK0
yhF9LIil+fjJSdbkJSNwTYa3Y3ykrSIWt91kr0tCu5S.rE8oFCGVIOOuqxyg
IPWIX0kWhUg2exe3R06QorSJi6pPM4AXWZ9Z.eODfPiiIYww8tZklx7Mw4mR
F9.gCVzuVjO4gPs6nLhW+rM7lpzyVLT548ky9wx+FO+vGZvOeb1uMyLpFcQW
zocCMxMynR7ssDxuexj288C93c5fAuiEH24F6GI5.fT9Q.zhA.mri.G1PD4h
OFfFhHG6XRQCDNzi.G58DG2ob5mPYC.ibaB2OR+rZHr9kuYy0f1z5sGDrFzG
UZ2s4S72Jjga8ePiHMbsny+4dKbMV+whEeZzP3PxyCmwKpVgajIaD9suF6nG
Bou9laeZyFdfI9xfi+x3uwKE3GK
-----------end_max5_patcher-----------
</code></pre>
*/
