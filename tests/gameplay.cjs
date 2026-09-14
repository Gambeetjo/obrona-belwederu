const assert = require('node:assert/strict');
require('node:fs').mkdirSync(require('node:path').resolve(__dirname,'../work'),{recursive:true});
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({headless:true, channel:'chrome'});
  try {
    const page = await browser.newPage({viewport:{width:1280,height:800}});
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(() => { window.requestAnimationFrame = () => 0; });
    await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
    await page.waitForFunction(() => typeof THREE !== 'undefined');
    const results=await page.evaluate(() => {
      const results=[];
      function check(name,condition) { if (!condition) throw new Error(name); results.push(name); }
      function fresh() { initGame(); enemies.forEach(e=>removeFromScene(e.mesh)); enemies=[]; Math.random=()=>0.99; }
      function enemy(type='normal',x=player.x+45,z=player.z) { spawnEnemy(type); const e=enemies.at(-1); e.x=x;e.z=z;e.mesh.position.set(x,0,z); return e; }
      fresh(); player.coalLevel=4; enemy('tank',player.x+120).speed=0; for(let i=0;i<12;i++)update(0.1);
      check('Coal upgrade fires a projectile', Number.isFinite(player.coalTimer) && projectiles.some(p=>p.isCoal));
      fresh(); const burned=enemy('tank'); player.fireLevel=2; performPlayerAttack(); const hp=burned.hp; update(0.1);
      check('Fire applies damage over time', burned.hp < hp && burned.burnTimer < 3);
      fresh(); const impact=enemy('tank'), nearby=enemy('tank',player.x+50); player.explosiveCoal=2; player.coalLevel=4;
      const before=nearby.hp; const mesh=new THREE.Mesh(geos.box,mats.coalMat);mesh.position.set(impact.x,10,impact.z);scene.add(mesh);
      projectiles.push({mesh,x:impact.x,z:impact.z,vx:0,vz:0,vy:0,dmg:50,life:1,isPlayer:true,isCoal:true});update(0.01);
      check('Explosive coal splash and evolution fragments', nearby.hp<before && projectiles.filter(p=>p.isPlayer&&!p.isCoal).length===6);
      fresh(); player.shieldLevel=0.5; player.isDashing=true; damagePlayer(80);check('Dash blocks damage',player.hp===100);
      player.isDashing=false; damagePlayer(80);check('Shield reduces damage exactly once',player.hp===60);
      house.armor=0.4;damageHouse(50);check('House armor and repair delay',house.hp===120 && house.lastHitTime===gameTime);
      fresh();const attacker=enemy('normal',player.x+28); const hpBefore=player.hp;for(let i=0;i<20;i++)update(0.05);
      check('Melee enemy closes the gap and deals damage',player.hp<hpBefore);
      fresh();wave=5;const boss=enemy('mexicano',200,200);waveTimer=19.9;update(0.2);check('Boss encounter blocks next wave',wave===5);
      boss.hp=0;update(0.01);check('Boss awards one queued upgrade',gameState==='levelup'&&pendingRewards===1);resumeGame();update(0.01);check('Boss victory advances wave',wave===6);
      fresh();house.regenRate=22;house.pulseLevel=3;house.pulseTimer=4;const oldRange=player.rangeMesh;initGame();check('Restart resets house and removes old range',house.regenRate===2&&house.pulseLevel===0&&!scene.children.includes(oldRange));
      toggleHelpScreen();const clock=gameTime;update(1);check('Help pauses simulation',gameState==='help'&&gameTime===clock);toggleHelpScreen();check('Closing help restores playing',gameState==='playing');
      fresh();xp=20;checkLevelUp();check('Multiple XP levels queue choices',pendingRewards>1);const rewards=pendingRewards;resumeGame();check('Choice consumes one queued reward',pendingRewards===rewards-1&&gameState==='levelup');
      fresh();const target=enemy('mexicano',player.x+60);const bottle=createZubrCanMesh();scene.add(bottle);projectiles.push({mesh:bottle,x:player.x+20,z:player.z,vx:-50,vz:0,dmg:30,life:2,target:'player'});performPlayerAttack();check('Parry reflects instead of deleting',projectiles.length===1&&projectiles[0].reflected&&projectiles[0].dmg===60);
      for(let i=0;i<10;i++)update(0.03);check('Reflected projectile builds boss stagger',target.stagger>0);
      fresh();spawnFlyingMilk(5);player.shieldLevel=0.25;const incoming=createZubrCanMesh();scene.add(incoming);projectiles.push({mesh:incoming,x:player.x+10,z:player.z,vx:0,vz:0,dmg:30,life:2,target:'player'});update(0.01);check('Milk evolution intercepts projectile',player.hp===100&&player.milkShieldTimer>0&&!projectiles.length);
      fresh();wave=3;spawnOpeningEnemies(3);check('Post wave has two-sided composition',waveEvent==='post'&&enemies.some(e=>e.type==='thrower')&&enemies.some(e=>e.type==='tank'));
      fresh();wave=20;const final=enemy('final_boss');final.hp=0;update(0.01);check('Final boss starts ending without upgrade screen',endingSequence&&ambulance&&gameState==='playing');ambulance.step=4;update(0.01);check('Victory saves result',gameState==='gameover'&&resultSaved&&JSON.parse(localStorage.getItem('belweder-scores')).some(r=>r.won));
      fresh();for(let n=0;n<3;n++){renderer.render(scene,camera);initGame();collectResources();}renderer.render(scene,camera);const count=renderer.info.memory.geometries;for(let n=0;n<5;n++){initGame();renderer.render(scene,camera);collectResources();}renderer.render(scene,camera);check('Restart geometry allocation stays bounded',renderer.info.memory.geometries<=count+2);
      return results;
    });
    console.log(results.map(x=>'PASS '+x).join('\n'));
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(()=>{initGame();renderer.render(scene,camera);});
    await page.screenshot({path:path.resolve(__dirname,'../work/mobile.png')});
    await page.evaluate(()=>{
      const canvas=renderer.domElement;
      const pointer=(type,id,x,y)=>canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:id,pointerType:'touch',clientX:x,clientY:y}));
      // Synthetic pointers cannot be captured; test ownership with pointermove/release state directly.
      joystickPointer=1;joystick.active=true;touchStartX=70;touchStartY=600;
      pointer('pointermove',1,90,600); if(!(joystick.x>0&&joystick.x<1))throw Error('Analog joystick');
      attackPointers.add(2);isAttackingPressed=true;releasePointer({pointerId:2});if(!joystick.active||isAttackingPressed)throw Error('Pointer independence');
      releasePointer({pointerId:1});if(joystick.active)throw Error('Joystick release');
    });
    console.log('PASS mobile analog movement and independent pointer release');
    assert.deepEqual(errors,[]);console.log('PASS no browser exceptions');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
