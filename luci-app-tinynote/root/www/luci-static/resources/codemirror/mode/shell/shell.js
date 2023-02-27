// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode('shell', function() {

  var words = {};
  function define(style, dict) {
    for(var i = 0; i < dict.length; i++) {
      words[dict[i]] = style;
    }
  };

  var commonAtoms = ["true", "false"];
  var commonKeywords = ["if", "then", "do", "else", "elif", "while", "until", "for", "in", "esac", "fi",
    "fin", "fil", "done", "exit", "set", "unset", "export", "function", "select", "case"];
    
  var commonCommands = ["add", "alias", "apropos", "apt", "apt-cache", "apt-get", "aptitude", "aspell", "automysqlbackup", "awk", "basename", "bash", "bc", "bconsole", "bg", "bind", "break", "builtin", "bzip2", "cal", "caller", "cargo", "cat", "cd", "cfdisk", "chgrp", "chkconfig", "chmod", "chown", "chroot", "cksum", "clear", "cmp", "column", "comm", "command", "composer", "continue", "cp", "cron", "crontab", "csplit", "curl", "cut", "date", "dc", "dd", "ddrescue", "debootstrap", "declare", "df", "diff", "diff3", "dig", "dir", "dircolors", "dirname", "dirs", "dmesg", "docker", "docker-compose", "du", "echo", "egrep", "eject", "enable", "env", "ethtool", "eval", "exec", "exit", "expand", "expect", "export", "expr", "fdformat", "fdisk", "fg", "fgrep", "file", "find", "fmt", "fold", "format", "free", "fsck", "ftp", "fuser", "gawk", "getopts", "git", "gparted", "grep", "groupadd", "groupdel", "groupmod", "groups", "grub-mkconfig", "gzip", "halt", "hash", "head", "help", "hg", "history", "host", "hostname", "htop", "iconv", "id", "ifconfig", "ifdown", "ifup", "import", "install", "ip", "java", "jobs", "join", "kill", "killall", "less", "let", "link", "ln", "local", "locate", "logname", "logout", "logrotate", "look", "lpc", "lpr", "lprint", "lprintd", "lprintq", "lprm", "ls", "lsof", "lynx", "make", "man", "mapfile", "mc", "mdadm", "mkconfig", "mkdir", "mke2fs", "mkfifo", "mkfs", "mkisofs", "mknod", "mkswap", "mmv", "more", "most", "mount", "mtools", "mtr", "mutt", "mv", "nano", "nc", "netstat", "nice", "nl", "node", "nohup", "notify-send", "npm", "nslookup", "op", "open", "parted", "passwd", "paste", "pathchk", "ping", "pkill", "pnpm", "podman", "podman-compose", "popd", "pr", "printcap", "printenv", "printf", "ps", "pushd", "pv", "pwd", "quota", "quotacheck", "quotactl", "ram", "rar", "rcp", "read", "readarray", "readonly", "reboot", "remsync", "rename", "renice", "return", "rev", "rm", "rmdir", "rpm", "rsync", "scp", "screen", "sdiff", "sed", "sendmail", "seq", "service", "set", "sftp", "sh", "shellcheck", "shift", "shopt", "shuf", "shutdown", "sleep", "slocate", "sort", "source", "split", "ssh", "stat", "strace", "su", "sudo", "sum", "suspend", "swapon", "sync", "sysctl", "tac", "tail", "tar", "tee", "test", "time", "timeout", "times", "top", "touch", "tr", "traceroute", "trap", "tsort", "tty", "type", "typeset", "uci", "ulimit", "umask", "umount", "unalias", "uname", "unexpand", "uniq", "units", "unrar", "unset", "unshar", "unzip", "update-grub", "uptime", "useradd", "userdel", "usermod", "users", "uudecode", "uuencode", "v", "vcpkg", "vdir", "vi", "vim", "virsh", "vmstat", "wait", "watch", "wc", "wget", "whereis", "which", "who", "whoami", "write", "xargs", "xdg-open", "yarn", "yes", "zenity", "zip", "zsh", "zypper"];

  CodeMirror.registerHelper("hintWords", "shell", commonAtoms.concat(commonKeywords, commonCommands));

  define('atom', commonAtoms);
  define('keyword', commonKeywords);
  define('builtin', commonCommands);

  function tokenBase(stream, state) {
    if (stream.eatSpace()) return null;

    var sol = stream.sol();
    var ch = stream.next();

    if (ch === '\\') {
      stream.next();
      return null;
    }
    if (ch === '\'' || ch === '"' || ch === '`') {
      state.tokens.unshift(tokenString(ch, ch === "`" ? "quote" : "string"));
      return tokenize(stream, state);
    }
    if (ch === '#') {
      if (sol && stream.eat('!')) {
        stream.skipToEnd();
        return 'meta'; // 'comment'?
      }
      stream.skipToEnd();
      return 'comment';
    }
    if (ch === '$') {
      state.tokens.unshift(tokenDollar);
      return tokenize(stream, state);
    }
    if (ch === '+' || ch === '=') {
      return 'operator';
    }
    if (ch === '-') {
      stream.eat('-');
      stream.eatWhile(/\w/);
      return 'attribute';
    }
    if (ch == "<") {
      if (stream.match("<<")) return "operator"
      var heredoc = stream.match(/^<-?\s*['"]?([^'"]*)['"]?/)
      if (heredoc) {
        state.tokens.unshift(tokenHeredoc(heredoc[1]))
        return 'string-2'
      }
    }
    if (/\d/.test(ch)) {
      stream.eatWhile(/\d/);
      if(stream.eol() || !/\w/.test(stream.peek())) {
        return 'number';
      }
    }
    stream.eatWhile(/[\w-]/);
    var cur = stream.current();
    if (stream.peek() === '=' && /\w+/.test(cur)) return 'def';
    return words.hasOwnProperty(cur) ? words[cur] : null;
  }

  function tokenString(quote, style) {
    var close = quote == "(" ? ")" : quote == "{" ? "}" : quote
    return function(stream, state) {
      var next, escaped = false;
      while ((next = stream.next()) != null) {
        if (next === close && !escaped) {
          state.tokens.shift();
          break;
        } else if (next === '$' && !escaped && quote !== "'" && stream.peek() != close) {
          escaped = true;
          stream.backUp(1);
          state.tokens.unshift(tokenDollar);
          break;
        } else if (!escaped && quote !== close && next === quote) {
          state.tokens.unshift(tokenString(quote, style))
          return tokenize(stream, state)
        } else if (!escaped && /['"]/.test(next) && !/['"]/.test(quote)) {
          state.tokens.unshift(tokenStringStart(next, "string"));
          stream.backUp(1);
          break;
        }
        escaped = !escaped && next === '\\';
      }
      return style;
    };
  };

  function tokenStringStart(quote, style) {
    return function(stream, state) {
      state.tokens[0] = tokenString(quote, style)
      stream.next()
      return tokenize(stream, state)
    }
  }

  var tokenDollar = function(stream, state) {
    if (state.tokens.length > 1) stream.eat('$');
    var ch = stream.next()
    if (/['"({]/.test(ch)) {
      state.tokens[0] = tokenString(ch, ch == "(" ? "quote" : ch == "{" ? "def" : "string");
      return tokenize(stream, state);
    }
    if (!/\d/.test(ch)) stream.eatWhile(/\w/);
    state.tokens.shift();
    return 'def';
  };

  function tokenHeredoc(delim) {
    return function(stream, state) {
      if (stream.sol() && stream.string == delim) state.tokens.shift()
      stream.skipToEnd()
      return "string-2"
    }
  }

  function tokenize(stream, state) {
    return (state.tokens[0] || tokenBase) (stream, state);
  };

  return {
    startState: function() {return {tokens:[]};},
    token: function(stream, state) {
      return tokenize(stream, state);
    },
    closeBrackets: "()[]{}''\"\"``",
    lineComment: '#',
    fold: "brace"
  };
});

CodeMirror.defineMIME('text/x-sh', 'shell');
// Apache uses a slightly different Media Type for Shell scripts
// http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
CodeMirror.defineMIME('application/x-sh', 'shell');

});
