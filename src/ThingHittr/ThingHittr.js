function ThingHittr(settings) {
    "use strict";
    if(!this || this === window) {
        return new ThingHittr(settings);
    }
    var self = this,
        
        // GroupHoldr object used to hold the groups and manipulate contents
        GroupHolder,
        
        // QuadsKeepr object used for collision checking
        QuadsKeeper,
        
        // Container for functions to collision check between specific types
        // E.x. ["character"] = { "solid": function(a,b) {...} }
        hit_checks,
        // Quick reference of Object.keys(hit_checks)
        hit_check_keys,
        
        // Container for functions to react to collisions between specific types
        // E.x. ["character"] = { "solid": function(a,b) {...} }
        hit_functions,
        
        // Container for functions to check and react to objects having overlaps
        overlap_functions,
        
        // Global check functions, such as can_collide
        global_checks,
        
        // Optional scope variable to bind important functions to
        scope;
    
    /**
     * 
     */
    self.reset = function(settings) {
        // Get the main containers from settings, or make new ones if necessary
        GroupHolder = settings.GroupHolder || new GroupHoldr(settings);
        QuadsKeeper = settings.QuadsKeeper || new QuadsKeepr(settings);
        
        // Collision checking information should be given in the settings
        if(!settings.hit_checks) {
            throw new Error("No hit_checks given to ThingHittr");
        }
        hit_checks = settings.hit_checks;
        hit_check_keys = Object.keys(hit_checks);
        
        // Collision functions should be given in the settings
        if(!settings.hit_functions) {
            throw new Error("No hit_functions given to ThingHittr");
        }
        hit_functions = settings.hit_functions;
        
        // Overlap functions may be given in the settings
        overlap_functions = settings.overlap_functions || {};
        
        // Global checks should be given in the settings
        if(!settings.global_checks) {
            throw new Error("No global_checks given to ThingHittr");
        }
        global_checks = settings.global_checks;
        
        // If a scope is provided, make external hit checks and functions use it
        // as their "this" variable (very good for EightBittr objects)
        if(settings.scope) {
            setScopeAll(hit_checks, settings.scope);
            setScopeAll(hit_functions, settings.scope);
            setScopeAll(overlap_functions, settings.scope);
            setScopeAll(global_checks, settings.scope);
        }
    };
    
    
    /* Simple gets
    */
    
    /**
     * 
     */
    self.getGroupHolder = function() {
        return GroupHolder;
    }
    
    /**
     * 
     */
    self.getQuadsKeeper = function() {
        return QuadsKeeper;
    }
    
    /**
     * 
     */
    self.getHitChecks = function(a, b) {
        switch(arguments.length) {
            case 0:
                return hit_checks;
            case 1:
                return hit_checks[a];
            default:
                return hit_checks[a][b];
        }
    }
    
    
    /* Runtime
    */
    
    /**
     * 
     */
    self.checkHits = function() {
        hit_check_keys.forEach(self.checkHitsOfGroup);
    };
    
    /**
     * 
     */
    self.checkHitsOfGroup = function(type) {
        GroupHolder["get" + type + "Group"]().forEach(self.checkHitsOfOne);
    }
    
    /**
     * 
     */
    self.checkHitsOfOne = function(thing, id) {
        var others, other,
            i, j;
         
        // Don't do anything if the thing shouldn't be checking
        if(!global_checks[thing.grouptype].can_collide(thing)) {
            return;
        }
        
        // For each quadrant this is in, find each other thing in that quadrant
        for(i = 0; i < thing.numquads; ++i) {
            others = thing.quadrants[i].things;
            for(j = 0; j < others.length; ++j) {
                other = others[j];
                
                // If the two are the same, breaking prevents double hits
                if(thing === other) {
                    break;
                }
                
                // Check whether a collision should be happening
                tryCollision(hit_checks[thing.grouptype][other.grouptype]
                        , thing, other, id);
            }
        }
    }
    
    /**
     * 
     */
    function tryCollision(hit_check, thing, other, id) {
        // If there's no hit_checks[~][~], hit_check will be falsy, so skip it
        if(!hit_check) {
            return;
        }
        
        // Also do nothing if these two shouldn't be colliding
        if(!global_checks[other.grouptype].can_collide(other)) {
            return;
        }
        
        // If they do hit, great! Do the corresponding hit_function
        if(hit_check(thing, other)) {
            hit_functions[thing.grouptype][other.grouptype](thing, other);
        }
    }
    
    /**
     * 
     */
    function setScopeAll(functions, scope) {
        var i;
        for(i in functions) {
            if(functions.hasOwnProperty(i)) {
                switch(typeof(functions[i])) {
                    case "function":
                        functions[i] = functions[i].bind(scope);
                        break;
                    case "object":
                        setScopeAll(functions[i], scope);
                        break;
                }
            }
        }
    }
    
    self.reset(settings || {});
}