#!/bin/bash 
COUNTER=0
while [  $COUNTER -lt 76 ]; do
   node x $COUNTER
   let COUNTER=COUNTER+1 
done