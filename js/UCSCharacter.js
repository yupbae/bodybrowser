THREE.UCSCharacter = function() {

	var scope = this;
	
	var mesh;
	var bodyd = [];
	bodyd[0] =  '';
	bodyd[1] = 'The body\'s muscular system consists of about 650 muscles that aid in movement, blood flow and other bodily functions. There are three types of muscle: skeletal muscle which is connected to bone and helps with voluntary movement, smooth muscle which is found inside organs and helps to move substances through organs, and cardiac muscle which is found in the heart and helps pump blood.';
	bodyd[2] = 'The human skeleton consists of 206 bones that are connected by tendons, ligaments and cartilage. The skeleton not only helps us move, but it is also involved in the production of blood cells and the storage of calcium. The teeth are also part of the skeletal system, but they arent considered bones.';
	bodyd[3] = 'The nervous system controls both voluntary action (like conscious movement) and involuntary actions (like breathing), and sends signals to different parts of the body. The central nervous system includes the brain and spinal cord. The peripheral nervous system consists of nerves that connect every other part of the body to the central nervous system.';
	bodyd[4] = 'The job of the circulatory system, also called the cardiovascular system, is to move blood, nutrients, oxygen, carbon dioxide, and hormones, around the body. It consists of the heart, blood, blood vessels,arteries and veins. The heart and circulatory system (also called the cardiovascular system) make up the network that delivers blood to the body\'s tissues.';
	bodyd[5] = 'The respiratory system allows us to take in vital oxygen and expel carbon dioxide in a process we call breathing. It consists mainly of the trachea, the diaphragm and the lungs. The lungs take in oxygen and help you breathe out carbon dioxide. Humans have an intricate respiratory system, with hundreds of millions of tiny air sacs called alveoli, where all of the magic happens.';
	bodyd[6] = 'The digestive system consists of a series of connected organs that together, allow the body to break down and absorb food, and remove waste. It includes the mouth, esophagus, stomach, small intestine, large intestine, rectum, and anus. The liver and pancreas also play a role in the digestive system because they produce digestive juices.';
	
	this.scale = 1;
	this.infodis = 0;
	this.root = new THREE.Object3D();
	
	this.numSkins;
	this.numMorphs;
	
	this.skins = [];
	this.materials = [];
	this.morphs = [];

	this.onLoadComplete = function () {};
	
	this.loadCounter = 0;

	this.loadParts = function ( config ) {
		
		this.numSkins = config.skins.length;
		this.numMorphs = config.morphs.length;
		
		// Character geometry + number of skins
		this.loadCounter = 1 + config.skins.length;
		
		// SKINS
		//alert('hi');
		console.log('UCSCharacter loadParts');
		this.skins = loadTextures( config.baseUrl + "skins/", config.skins );
		this.materials = createMaterials( this.skins );
		
		// MORPHS
		this.morphs = config.morphs;
		
		// CHARACTER
		var loader = new THREE.JSONLoader();
		console.log( config.baseUrl + config.character );
		loader.load( config.baseUrl + config.character, function( geometry ) {
			geometry.computeBoundingBox();
			geometry.computeVertexNormals();

			//THREE.AnimationHandler.add( geometry.animation );

			mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial() );
			scope.root.add( mesh );
			
			var bb = geometry.boundingBox;
			scope.root.scale.set( config.s, config.s, config.s );
			scope.root.position.set( config.x, config.y - bb.min.y * config.s, config.z );

			mesh.castShadow = true;
			mesh.receiveShadow = true;

			animation = new THREE.Animation( mesh, geometry.animation );
			animation.play();
			
			scope.setSkin(0);
			
			scope.checkLoadComplete();
		} );

	};
	
	this.setSkin = function( index ) {
		if(!this.infodis){
			this.infodis = 1;
		}else{
			$("#info").html(bodyd[index]);
			
			if(bodyd[index].length>0)						
			{
			$("#info").show();
			$("#info").attr("class","alert alert-success fade in alert-dismissable");
			$("#info").attr("style","padding:1%");
			}
		
		else
		{
			$("#info").hide();
			// $("#info").removeClass("alert alert-success fade in alert-dismissable");
			
		}
		}
		console.log('UCSCharacter setSkin' + index );
		
		if ( mesh && scope.materials ) {
			mesh.material = scope.materials[ index ];
		}
	};
	
	this.updateMorphs = function( influences ) {
		console.log('UCSCharacter updateMorphs');
		if ( mesh ) {
			for ( var i = 0; i < scope.numMorphs; i ++ ) {
				mesh.morphTargetInfluences[ i ] = influences[ scope.morphs[ i ] ] / 100;
			}
		}
	}
	
	function loadTextures( baseUrl, textureUrls ) {
		console.log('loadTextures UCSCharacter');
		var mapping = THREE.UVMapping;
		var textures = [];

		for ( var i = 0; i < textureUrls.length; i ++ ) {

			textures[ i ] = THREE.ImageUtils.loadTexture( baseUrl + textureUrls[ i ], mapping, scope.checkLoadComplete );

			var name = textureUrls[ i ];
			name = name.replace(/\.jpg/g, "");
			textures[ i ].name = name;
			console.log(textures[ i ].name );

		}

		return textures;
	};

	function createMaterials( skins ) {
		var materials = [];
		console.log('createMaterials UCSCharacter');
		for ( var i = 0; i < skins.length; i ++ ) {

			materials[ i ] = new THREE.MeshLambertMaterial( {
				color: 0xeeeeee,
				specular: 10.0,
				map: skins[ i ],
				skinning: true,
				morphTargets: true,
				wrapAround: true
			} );

		}
		
		return materials;
	}

	this.checkLoadComplete = function () {
		console.log('checkLoadComplete');
		scope.loadCounter -= 1;

		if ( scope.loadCounter === 0 ) {

			scope.onLoadComplete();

		}

	}

}
