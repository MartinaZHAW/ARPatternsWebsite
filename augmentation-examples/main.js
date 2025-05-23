import { bootstrapCameraKit, createMediaStreamSource, Transform2D } from "@snap/camera-kit";

async function startUp() {
  const token = import.meta.env.VITE_API_KEY;

  console.log(token);

  const cameraKit = await bootstrapCameraKit({
    apiToken: token
  });

  const liveRenderTarget = document.getElementById('canvas');
  const session = await cameraKit.createSession({ liveRenderTarget });

  let mediaStream = null;

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        aspectRatio: { exact: 0.56 }
      }
    });
  } catch (err) {
    alert("The lens can't be used because no camera is connected. Connect a camera, then reload the page.");
  }

  const source = createMediaStreamSource(mediaStream, {
    transform: Transform2D.MirrorX,
    cameraType: 'front'
  });

  await session.setSource(source);
  await session.play();

  return [cameraKit, session];
}

let cameraKit;
let session;

startUp().then(([cameraKitReturned, sessionReturned]) => {
  cameraKit = cameraKitReturned;
  session = sessionReturned;
});

const dragonSnacksButton = document.getElementById('dragon_snacks');
dragonSnacksButton.onclick = () => {
  console.log("Dragon Snacks!");
  displayLens("dragon_snacks");
}

const puppetDanceButton = document.getElementById('puppet_dance');
puppetDanceButton.onclick = () => {
  console.log("Puppet Dance!");
  displayLens("puppet_dance");
}

const oceanCleanUpButton = document.getElementById('ocean_clean_up');
oceanCleanUpButton.onclick = () => {
  console.log("Ocean Clean-Up!");
  displayLens("ocean_clean_up");
}

const segmentOverlayButton = document.getElementById('segment_overlay');
segmentOverlayButton.onclick = () => {
  console.log("Segment Overlay!");
  displayLens("segment_overlay");
}

const superimpositionBtton = document.getElementById('superimposition');
superimpositionBtton.onclick = () => {
  console.log("Superimposition!");
  displayLens("superimposition");
}

const areaEnrichmentButton = document.getElementById('area_enrichment');
areaEnrichmentButton.onclick = () => {
  console.log("Area Enrichment!");
  displayLens("area_enrichment");
}

const aheadStagingButton = document.getElementById('ahead_staging');
aheadStagingButton.onclick = () => {
  console.log("Ahead Staging!");
  displayLens("ahead_staging");
}

async function displayLens(lensName) {
  let lensID = null;
  const groupID = import.meta.env.VITE_GROUP_ID;

  if (lensName == "dragon_snacks") {
    lensID = import.meta.env.VITE_DRAGON_SNACKS_LENS_ID;
  } else if (lensName == "puppet_dance") {
    lensID = import.meta.env.VITE_PUPPET_DANCE_LENS_ID;
  } else if (lensName == "ocean_clean_up") {
    lensID = import.meta.env.VITE_OCEAN_CLEAN_UP_LENS_ID;
  } else if (lensName == "segment_overlay") {
    lensID = import.meta.env.VITE_SEGMENT_OVERLAY;
  } else if (lensName == "superimposition") {
    lensID = import.meta.env.VITE_SUPERIMPOSITION;
  } else if (lensName == "area_enrichment") {
    lensID = import.meta.env.VITE_AREA_ENRICHMENT;
  } else {
    lensID = import.meta.env.VITE_AHEAD_STAGING;
  }

  console.log(cameraKit);

  const lens = await cameraKit.lensRepository.loadLens(lensID, groupID);
  session.applyLens(lens);

  return lens;
}