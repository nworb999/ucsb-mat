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
AudioSynthWaveformDc offset;      //xy=69,394
AudioSynthWaveform LFO;           //xy=73,213
AudioSynthWaveformDc pitch;       //xy=112,145
AudioMixer4 mixer2;               //xy=174,315
AudioSynthWaveformModulated VCO;  //xy=246,220
AudioMixer4 feedback;             //xy=410,239
AudioEffectDelay delay1;          //xy=451,488
AudioFilterLadder VCF;            //xy=554,251
AudioAmplifier volume;            //xy=701,251
AudioOutputI2S output;            //xy=856,258
AudioConnection patchCord1(offset, 0, mixer2, 1);
AudioConnection patchCord2(LFO, 0, mixer2, 0);
AudioConnection patchCord3(pitch, 0, VCO, 0);
AudioConnection patchCord4(VCO, 0, feedback, 0);
AudioConnection patchCord5(feedback, 0, VCF, 0);
AudioConnection patchCord6(delay1, 0, feedback, 1);
AudioConnection patchCord7(VCF, delay1);
AudioConnection patchCord8(VCF, volume);
AudioConnection patchCord9(volume, 0, output, 0);
AudioConnection patchCord10(volume, 0, output, 1);
AudioControlSGTL5000 sgtl5000_1;  //xy=861,206
// GUItool: end automatically generated code


class AudioEffectOnePole : public AudioStream {
  audio_block_t *inputQueueArray[1];
  float y1{ 0 };
  float a{ 0 }, b{ 1 };  // bypass condition
public:
  AudioEffectOnePole()
    : AudioStream(1, inputQueueArray) {}

  virtual void update(void) {
    audio_block_t *input = receiveReadOnly(0);
    audio_block_t *output = allocate();
    // !
    for (int i = 0; i < AUDIO_BLOCK_SAMPLES; ++i) {
      float x = input->data[i] / 32767;
      y1 = a * y1 + b * x;  // float (-1, 1)
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

AudioEffectOnePole poleFilter;

float mtof(float midi) {
  return 440.0 * pow(2.0, (midi - 69.0) / 12.0);
}

float dbtoa(float db) {
  return pow(10.0, db / 20.0);
}

const byte cMinorScale[] = { 60, 62, 63, 65, 67, 68, 70 };  // C, D, Eb, F, G, Ab, Bb

byte generateRandomNote() {
  byte scaleSize = sizeof(cMinorScale) / sizeof(cMinorScale[0]);
  byte randomIndex = random(0, scaleSize);  // Pick a random index
  return cMinorScale[randomIndex];          // Return the note at the index
}

float generateRandomFrequency() {
  // Define the frequency range (for example, 100 Hz to 3000 Hz)
  float minFrequency = 100.0;
  float maxFrequency = 3000.0;

  return random(minFrequency, maxFrequency);
}

void noteOn() {
  digitalWrite(13, HIGH);

  byte melodyNote = generateRandomNote();

  float frequency = mtof(melodyNote);
  poleFilter.frequency(frequency);

  VCO.frequency(frequency);
  VCO.amplitude(1.0);
}

void noteOff() {
  digitalWrite(13, LOW);

  VCO.frequency(0);
  VCO.amplitude(0);
  poleFilter.frequency(0);
}

float startVolume = 0.4;

void setup() {
  Serial.begin(9600);

  AudioMemory(200);
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
  VCO.begin(WAVEFORM_SAWTOOTH);
  VCO.frequency(0);
  VCO.amplitude(0);
  poleFilter.frequency(0);

  volume.gain(startVolume);                       // VOLUME knob; add this knob/CC
  VCF.frequency(15000);                           // CUTOFF knob; add this knob/CC
  VCF.resonance(0.5);                             // add a knob/CC for this; Monotron Delay does not have this
  feedback.gain(0, 1.0);                          // pass VCO signal
  feedback.gain(3, 0.0);                          // FEEDBACK knob; add this knob/CC
  LFO.begin(0.5, 1.0, WAVEFORM_BANDLIMIT_PULSE);  // also WAVEFORM_TRIANGLE
  LFO.pulseWidth(0.5);                            // add a knob//CC for this; Monotron Delay does not have this
  mixer2.gain(0, 0.0);
  mixer2.gain(1, 1.0);
  VCO.frequencyModulation(2.0);

  // Blink LED once at startup
  digitalWrite(LED_BUILTIN, HIGH);
  delay(400);
  digitalWrite(LED_BUILTIN, LOW);

  randomSeed(analogRead(0));
}

inline float kymap(float value, float low, float high, float Low, float High) {
  return Low + (High - Low) * ((value - low) / (high - low));
}

  unsigned long lastNoteOnTime = 0;
  unsigned long lastNoteOffTime = 0;
  const unsigned long noteInterval = 1000;
  const unsigned long noteDuration = 500;
  bool noteIsOn = false;

void loop() {
  unsigned long currentTime = millis();
  if (!noteIsOn && currentTime - lastNoteOnTime > noteInterval) {
    // Time to start a new note
    noteOn();
    noteIsOn = true;
    lastNoteOnTime = currentTime;
    lastNoteOffTime = currentTime;  // Reset the noteOff timer
  } else if (noteIsOn && currentTime - lastNoteOffTime > noteDuration) {
    // Duration elapsed, turn the note off
    noteOff();
    noteIsOn = false;
  }

  volume.gain(dbtoa(kymap(analogRead(A17), 0, 1023, -35, 2)));                                      // knob 1 (41, A17)
  VCF.frequency(mtof(kymap(analogRead(A14), 0, 1023, 50.0, 127.0)));                                // knob 2 (38, A14)
  LFO.pulseWidth(kymap(analogRead(A14), 0, 1023, 0, 2));                                            // knob 3 (40, A16)
  LFO.amplitude(dbtoa(kymap(analogRead(A15), 0, 1023, -65.0, 0.0 + dbtoa(-65.0)) - dbtoa(-65.0)));  // knob 4 (39, A15)
  feedback.gain(3, mtof(kymap(analogRead(A10), 0, 1023, 0.0, 127.0)));                              // knob 5 (24, A10)
  //offset.amplitude(map(analogRead(A16), 0, 1023, -1.0, 1.0));
  // LFO.offset(map(analogRead(A16), 0, 1023, -0.5, 0.5)); // knob 5

  static float last = 0;
  float f = 0;
  if (abs(f - last) < 0.013) {
    f = last;  // ignore value that is not that different
  }
  last = f;
  pitch.amplitude(f, 2);

  Serial.println(f, 5);
  delay(2);
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
