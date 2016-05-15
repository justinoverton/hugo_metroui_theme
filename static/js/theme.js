
$( document ).ready(
    function() {
        
        function HashReader(strHash) {
            this.hash = strHash.split('');
            this.cur = 0;
            this.bitsRead = 0;
        }
        
        HashReader.prototype.next = function(bits) {
            
            if(this.bitsRead < bits) {
                var bytesNeeded = Math.ceil((bits - this.bitsRead) / 8);
                
                var additional = parseInt(this.hash.splice(0, bytesNeeded).join(''), 16);
                var newBits = bytesNeeded * 8;
                this.cur = ((this.cur >> newBits) & ((1 << this.bitsRead - newBits) - 1)) | additional;
                this.bitsRead += newBits;
            }
            
            this.bitsRead -= bits;
            
            var ret = this.cur & ((1 << bits) - 1);
            
            this.cur = (this.cur >> bits) & ((1 << this.bitsRead) - 1);
            
            return ret;
        };
        
        HashReader.prototype.hashHex = function() {
            
            var ret = this.hash.join('');
            
            if(this.cur > 0) {
                ret = (this.cur.toString(16)) + ret;
            }
            
            return ret;
        };
        
        var generators = {
            tile_size: ['tile','tile','tile','tile-wide'],
            tile_bg_color: ['bg-darkRed','bg-darkBlue','bg-darkOrange','bg-green']
        };
        
        $('[data-tile-auto-gen]').each(function(i, e){
            e = $(e);
            var p = e.parent('[data-hash]');
            if(!p)
                return;
            var hr = new HashReader(p.attr('data-hash'));
            
            var gens = e.attr('data-tile-auto-gen').trim().split(' ');
            for(var i=0; i<gens.length; i++) {
                var key = gens[i].trim();
                var f = generators[key];
                if(f && f.length > 0) {
                    
                    var idx = hr.next(f.length.toString(2).length) % f.length;
                    e.addClass(f[idx]);
                }
            }
            
        });
        
    }
);