import themidibus.*;
import ddf.minim.*;
import ddf.minim.ugens.*;
import controlP5.*;

ControlP5 cp5;
Minim minim;
AudioOutput out;
MidiBus myBus;

int[] melody = {60, 62, 65, 67, 69, 72, 74};
int melodyIndex = 0;

int lastPlayTime = 0;
int duration = 0;
int staggerTime = 2000;

int channel0 = 0;
int channel1 = 1;

float [][] transitionMatrix = {
  {0.5, 0.0, 0.2, 0.1, 0.1, 0.1, 0.0},
  {0.2, 0.1, 0.2, 0.3, 0.1, 0.1, 0.0},
  {0.5, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0},
  {0.1, 0.1, 0.1, 0.0, 0.1, 0.1, 0.5},
  {0.4, 0.1, 0.2, 0.1, 0.0, 0.1, 0.1},
  {0.3, 0.1, 0.2, 0.3, 0.0, 0.1, 0.0},
  {0.1, 0.1, 0.2, 0.3, 0.1, 0.1, 0.1},
};

float phase = 0;
float frequency = 0.1;

void setup() {
  size(400, 400);
  background(0);
  minim = new Minim(this);
  out = minim.getLineOut();
  myBus = new MidiBus(this, -1, "to Max 1");

  cp5 = new ControlP5(this);
  cp5.addSlider("frequency").setPosition(50, 50).setRange(0.001, 0.1).setValue(frequency);
}

void draw() {
  if (millis() - lastPlayTime >= duration) {
    playMelody();
    lastPlayTime = millis();
  }
  int feedbackMidiValue = generateSineMIDIValue();
  delay(staggerTime);
  int timeMidiValue = generateSineMIDIValue();
  
  int rateMidiValue = generateTanMIDIValue();
  delay(staggerTime);
  int resonanceMidiValue = generateTanMIDIValue();
  
  myBus.sendControllerChange(channel1, 10, timeMidiValue);
  myBus.sendControllerChange(channel1, 11, feedbackMidiValue);
  myBus.sendControllerChange(channel1, 12, rateMidiValue);
  myBus.sendControllerChange(channel1, 13, resonanceMidiValue);
}

void playMelody()
{
  int note = melody[melodyIndex];
  int velocity = int(randomGaussian() * 4 + 124);
  duration = int(randomGaussian() * 100 + 200);

  myBus.sendNoteOn(channel0, note, velocity);
  delay(duration);
  myBus.sendNoteOff(channel0, note, velocity);

  int[] chord = generateChord(note);
  for (int i = 0; i < chord.length; i++) {
    myBus.sendNoteOn(channel0, chord[i], velocity);
    delay(duration);
    myBus.sendNoteOff(channel0, chord[i], velocity);
  }

  melodyIndex = getNextMelodyIndex(melodyIndex);
}

int [] generateChord(int note)
{
  int[] scaleIntervals = {2, 3, 5, 7, 9};

  int chordLength = constrain(int(randomGaussian() * 1.5 + 3.5), 1, 5);
  int[] chordNotes = new int[chordLength];

  for (int i = 1; i < chordLength; i++) {
    chordNotes[i] = note + scaleIntervals[int(random(scaleIntervals.length))];
  }


  return chordNotes;
}

int getNextMelodyIndex(int currentIndex) {
  float randomNum = random(1);
  for (int i = 0; i < melody.length; i++) {
    if (randomNum <= transitionMatrix[currentIndex][i]) {
      return i;
    } else {
      randomNum -= transitionMatrix[currentIndex][i];
    }
  }
  return int(random(melody.length));
}

int generateSineMIDIValue() {
  float sineValue = sin(phase) * 0.5 + 0.5;
  phase += frequency;
  return int(sineValue * 127);
}

int generateTanMIDIValue() {
  float tanValue = tan(phase) * 0.5 + 0.5;
  phase += frequency;
  return int(tanValue * 127);
}

void delay(int time) {
  int current = millis();
  while (millis () < current+time) Thread.yield();
}

/*

 <pre><code>
 ----------begin_max5_patcher----------
 876.3ocwXszbZCCD9L7qPiOSYjeA3dtW5zIyzK8TSmLJ1BhRjk7HISflI42d
 WKYGHASw3XZmIAauHse629Rq4owi7tUtgp8PeF8SznQOMdzHqnJAipedjWNY
 SJmnsKyKUlmSEFuItuyP2Xrx+glhL2wznBhI8NDQjAORQjTXCEDwVlXE56JY
 JUqqtU+.sZYFIprHiXnnsxRE5aR0JzURgznjBzWnbxVjhVvYoDjVBJjXPLCH
 JkxVS0nbVFCkJEvx4SQeMuPIWWqpCwBT.r2BPmZDnNVdAmhJXftPxkn7RMKc
 B7EKI4LNQgxobY1VjTAxp3fTyLLvpf0ZAP9nXZiWfyDzTYov5JhqEJJyYBN0
 X8a90BsdGvntA3fw42ihmMEOAEmT8YX.t5x7noXzu1oHYooQS3ZorLqeWd68
 eJHvqR1yiGW8wjNFIEzGgMePfL2HW5clTX9hJiNvO1QA6CAGkAMJxIxrsf5z
 hm2qaXOx4Oe.IGWpn5WP3oveyakkgGmkwXG8laiPw8kkZ1JAg2NWm0GtR+cF
 I8kVYSvwYSPrMNEEFZuD27Y2S67i6i0thvDubtIXAtLrvEVa1OH7DN+FdmWx
 Mrz6HBAkulnXDWIJ9DwlIGKWLx6UaTQxoFp5FpfbK2te7+2hvfZuRT3knJze
 .qBKEEjzGbUg8kk3jl9jcJQ3.VtjKIlp.s6lV4Ld.4rl734WhVyUWulv4WfN
 NI8gh4vAqjUzC3nOFJMmetrzOx2VT6Zu1+9psxuEC4IivzFLA5ZOXpkqHaP9
 W60yrW2Y8IK5KUYh1yXmMvrE5xoo8ji9XasYRvz3+JIWbz34jc+WQ3cW1+11
 bCwCaRczYmQii2yC3xqGrL5nALFmZ3uKgFkf62vetT5ZJ2mFx6EhasY79z1t
 .6T2u6cWrlWk725Kzv.6oM.UOn0DzNSLipMLAoZ998WTjaQs5u6JRIcAnYC.
 PvbxcDI+OJRcAn2ZMRUFUYyi9XHG0Enicb78Pi+GA8vy5t3vSFhTH7a7bWvp
 BKRmza5O.HE2EfvsG1vWbjWzdp5GKeoK81hGhfXGvI5z0htl4jhh0Tktd2VL
 givtWpdcFAXhDg6Q6uvhmhtl0r9YVIDEb1jANXpTYsSuMybmc6kKAfEkrZmK
 vV.R6wiB303zvqi31P0onied7efHfsGR
 -----------end_max5_patcher-----------
 </code></pre>
 
 */
