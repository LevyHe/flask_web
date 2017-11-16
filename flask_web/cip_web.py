#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Tue Jun 13 12:46:48 2017

@author: levy
"""
import time
import os
from hashlib import md5
from datetime import datetime
from flask import Flask, request, session, url_for, redirect, \
     render_template, abort, g, flash, _app_ctx_stack,jsonify
from werkzeug import check_password_hash, generate_password_hash
import MySQLdb
import json
import re

def pbbms_local_connection():
  conn= MySQLdb.connect(
          host='localhost',
          port = 3306,
          user='1111',
          passwd='1111',
          db ='1111',
          connect_timeout=2,
          autocommit=True,
          charset='utf8'
          )
  return conn

app = Flask('cip_web')
app.config.from_object(__name__)
app.config.from_envvar('MINITWIT_SETTINGS', silent=True)
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'flaskr.db'),
    DEBUG=True,
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default',
))

def query_db(query, args=(), one=False):
    """Queries the database and returns a list of dictionaries."""
    conn = pbbms_local_connection()
    cur=conn.cursor(cursorclass=MySQLdb.cursors.DictCursor)
    cur.execute(query,args)
    data=cur.fetchall()
    #cur.close
    #conn.close()
    return (data[0] if data else None) if one else data

def query_none(query,args=()):
    try:
        conn = pbbms_local_connection()
        cur=conn.cursor(cursorclass=MySQLdb.cursors.DictCursor)
        #print query
        cur.execute(query,args)
        #cur.close
        #conn.close()
        return True
    except Exception,e:
        print Exception,":",e
        return False
def get_history_(start_time,end_time,tagnme,tagtype):
    sql_str="select * from hy_pbbms_view_tagvalue where 1" 
    if len(tagnme)>0:
        sql_str+=" and (tagname like '%%%%%s%%%%' or tagshortdesc like '%%%%%s%%%%')"%(tagnme,tagnme)
    if int(tagtype)!=0:
        sql_str+=" and tagtype=%d"%(int(tagtype))
    sql_str+=";"
    taglist = query_db(sql_str)
    hlist=[]
    for tag in taglist:
        h_start=query_db("select * from hy_pbbms_tagshistory where tagname=%s and update_time<=%s order by id_num desc limit 0,1;",
                         [tag['tagname'],start_time], one=True)
        h_end=query_db("select * from hy_pbbms_tagshistory where tagname=%s and update_time>=%s order by id_num asc limit 0,1;",
                         [tag['tagname'],end_time], one=True)
        h_all=query_db("select * from hy_pbbms_tagshistory where tagname=%s and update_time>%s and update_time<=%s  order by id_num asc;",
                         [tag['tagname'],start_time,end_time])
        if(h_start):
            val=[start_time,h_start['tagvalue']]
            h_val=[val]
        else :
            h_val=[]
        for h in h_all:
            val=[str(h['update_time']),h['tagvalue']]
            h_val.append(val)
        if(len(h_val)>0):
            val=[end_time,h_val[-1][1]]
            h_val.append(val)
        h_dict={"tagname":tag['tagname'],"tagshortdesc":tag["tagshortdesc"],"typename":tag['typename'],
                "tagtype":tag['tagtype'],
                "h_val":h_val}
        hlist.append(h_dict)
    return hlist
    
def sql_insert_new_tag(tagname,**args):
    key = r"^_*[a-zA-Z]\w*((\[([1-9]\d{0,2}|0)\]){0,1})(.(_*[a-zA-Z]\w*((\[([1-9]\d{0,2}|0)\]){0,1})))*(.([1-9]\d{0,1}|0)|)$"
    if re.match(key, tagname) is None :
        return 0
    tag = query_db('''select tagname from hy_pbbms_tagsvalue where
        tagname = %s''', [tagname], one=True)
    if tag:           
        return 1
    tagshortdesc=None
    tagdesc=None
    is_disabled=0
    tagtype=0
    if 'tagshortdesc' in args.keys():
        tagshortdesc=args['tagshortdesc']
    if 'tagdesc' in args.keys():
        tagdesc=args['tagdesc']
    if 'is_disabled' in args.keys():
        is_disabled=args['is_disabled']    
    if 'tagtype' in args.keys():
        tagtype=args['tagtype']
        

    res = query_none('insert into hy_pbbms_tagsvalue values(%s,%s,null,now(),0,%s)'
                     ,[tagname,tagtype,is_disabled])
    #user = query_db('''select * from hy_pbbms_users where
    #    user_name = %s''', [request.form['user_name']], one=True)
    if res == False:
        return 2;
    res = query_none('replace into hy_pbbms_tagdesc values(%s,%s,%s)'
                     ,[tagname,tagshortdesc,tagdesc])
    if res == False:
        return 3
    else:
        return 4   


@app.before_request
def before_request():
    g.user = None
    if 'user_id' in session:
        g.user = query_db('select * from hy_pbbms_users where user_id = %s',
                          [session['user_id']], one=True)


@app.route('/')
def index_page():
    if(g.user):
         return redirect(url_for('home'))
    else:
         return redirect(url_for('login'))
    
    mess=query_db('SELECT * FROM pbbms.hy_pbbms_view_tagvalue;')
    devio=query_db("SELECT device_id,dest_ip,dest_port,if(isconnected=1,'Yes','No') as isconnected,b.error_desc FROM hy_pbbms_device_info as a left join hy_pbbms_tagerrordesc as b on a.error_state=b.error_state;")
    return render_template('Taglisttable.html',messages=mess,deviceinfo=devio)
    #return render_template('index.html')
    #return render_template('Taglisttable.html',messages=mess)
    #return render_template('Login.html')

@app.route('/home')
def home():
    if(g.user):
        mess=query_db('SELECT * FROM pbbms.hy_pbbms_view_tagvalue;')
        devio=query_db("SELECT device_id,dest_ip,dest_port,if(isconnected=1,'Yes','No') as isconnected,b.error_desc FROM hy_pbbms_device_info as a left join hy_pbbms_tagerrordesc as b on a.error_state=b.error_state;")
        return render_template('Taglisttable.html',messages=mess,deviceinfo=devio)
    else:
        return redirect(url_for('login'))
@app.route('/history', methods=['GET', 'POST'])        
def history():
    if not g.user:
        return redirect(url_for('login'))
    if request.method == 'GET':
        mess=query_db('SELECT * FROM pbbms.hy_pbbms_view_tagvalue;')
        devio=query_db("SELECT device_id,dest_ip,dest_port,if(isconnected=1,'Yes','No') as isconnected,b.error_desc FROM hy_pbbms_device_info as a left join hy_pbbms_tagerrordesc as b on a.error_state=b.error_state;")
        return render_template('HistoryList.html',messages=mess,deviceinfo=devio)   
    elif request.method == 'POST':
        start_time= str(request.form['start_time'])
        end_time= str(request.form['end_time'])
        tagname= request.form['tagnme'].strip()       
        tagnme= str(tagname.encode('UTF-8'))
        tagtype= str(request.form['tagtype'])
        hlist=get_history_(start_time,end_time,tagnme,tagtype)
        return jsonify(hlist=hlist)
@app.route('/login', methods=['GET', 'POST'])
def login():
    """Logs the user in."""
    if g.user:
        return redirect(url_for('home'))
    error = None
    if request.method == 'POST':
        user = query_db('''select * from hy_pbbms_users where
            user_name = %s''', [request.form['user_name']], one=True)
        if user is None:
            error = 'Invalid username'
        elif not check_password_hash(user['passwd'],
                                     request.form['password']):
            error ='Invalid password'
        else:
            session['user_id'] = user['user_id']
            return redirect(url_for('home'))
    return render_template('Login.html', error=error) 

@app.route('/logout')
def logout():
    """Logs the user out."""
    flash('You were logged out')
    session.pop('user_id', None)
    return redirect(url_for('login'))

@app.route('/add_new_tag', methods=['GET', 'POST'])
def add_new_tag():
    """Logs the user in."""
    if not g.user:
        return redirect(url_for('login'))
    error = None
    if request.method == 'POST':
        res_str=[u'标签名不合法',u'标签名重复重复',u'插入数据库错误',u'插入数据库错误2',u'成功']  
        is_disable=0 if (request.form.getlist('tag_isuse')==[]) else 1 
        print 'is_disable=%d'%(is_disable)
        res = sql_insert_new_tag(tagname=request.form['tagname'],
                                 tagdesc=request.form['tagdesc'],
                                 tagshortdesc=request.form['tagshortdesc'],
                                 tagtype=request.form['tag_type'],
                                 is_disabled=is_disable)
        if res != 4:
            return jsonify(error=res_str[res])
        else:
            return jsonify()
@app.route('/delete_tags', methods=['GET', 'POST'])
def delete_tags():
    if not g.user:
        return redirect(url_for('login'))
    error = None    
    if request.method == 'GET':    
        #mess=query_db('SELECT a.tagname as tagname ,tagshortdesc from hy_pbbms_tagsvalue as a left join hy_pbbms_tagdesc as b on a.tagname=b.tagname;')
        #devio=query_db("SELECT device_id,dest_ip,dest_port,if(isconnected=1,'Yes','No') as isconnected,b.error_desc FROM hy_pbbms_device_info as a left join hy_pbbms_tagerrordesc as b on a.error_state=b.error_state;")
        return redirect(url_for('home'))
    elif request.method == 'POST':    
        dlist=request.form.getlist('taglist[]')
        sql_str="'"+"','".join(dlist)+"'"
        res = query_none('delete from hy_pbbms_tagsvalue  where tagname in(%s);'%(sql_str))
        query_none('delete from hy_pbbms_tagdesc where tagname in(%s);'%(sql_str))
        if res==True:
            return jsonify()     
        else:
            return jsonify(error=u'数据库错误：删除选定的标签失败')   
@app.route('/import_tags', methods=['GET', 'POST'])
def import_tags():
    if not g.user:
        return redirect(url_for('login'))
    error = None    
    
    if request.method == 'GET':    
        print "get import_tags tag"
        #mess=query_db('SELECT a.tagname as tagname ,tagshortdesc from hy_pbbms_tagsvalue as a left join hy_pbbms_tagdesc as b on a.tagname=b.tagname;')
        #devio=query_db("SELECT device_id,dest_ip,dest_port,if(isconnected=1,'Yes','No') as isconnected,b.error_desc FROM hy_pbbms_device_info as a left join hy_pbbms_tagerrordesc as b on a.error_state=b.error_state;")
        return redirect(url_for('home'))
    elif request.method == 'POST':  
        res_str=[u'标签名不合法',u'重复',u'插入数据库错误',u'插入数据库错误2',u'成功']  
        a_str=u'['
        r_str=u'['
        a_count=0
        r_count=0
        dlist= json.loads(request.form['taglist'])
        print dlist
        for d in dlist:
            res=sql_insert_new_tag(tagname=d['tagname'],tagdesc=d['tagdesc'],tagshortdesc=d['tagshortdesc'])
            if res != 4 :
                r_str+=d['tagname']+':'+res_str[res&0x03]+','
                r_count+=1
            else :
                a_str+=d['tagname']+','
                a_count+=1
        a_str+=u']'
        r_str+=u']'
        a_str = u'成功添加%d条标签:\n'%(a_count)+a_str
        r_str = u'未成功添加%d条标签：\n'%(r_count)+r_str
        return jsonify(a_str=a_str,r_str=r_str)

@app.route("/device_manage", methods=['GET', 'POST'])
def device_manage():
    if not g.user:
        return redirect(url_for('login'))
    if request.method == 'GET':    
        print "get import_tags tag"
        #mess=query_db('SELECT a.tagname as tagname ,tagshortdesc from hy_pbbms_tagsvalue as a left join hy_pbbms_tagdesc as b on a.tagname=b.tagname;')
        #devio=query_db("SELECT device_id,dest_ip,dest_port,if(isconnected=1,'Yes','No') as isconnected,b.error_desc FROM hy_pbbms_device_info as a left join hy_pbbms_tagerrordesc as b on a.error_state=b.error_state;")
        return redirect(url_for('home'))
    elif request.method == 'POST':  
        try:
            res=query_none("update hy_pbbms_device_info set device_id=%s,dest_ip=%s,dest_port=%s where device_id=%s",
                           [request.form['dev_newid'], request.form['dev_ip'],
                            request.form['dev_port'],request.form['dev_oldid'],])
            if res==True:
                return jsonify()     
            else:
                return jsonify(error=u'设备信息修改设备：数据库错误')   
        except Exception,e:
            return jsonify(error=u"数据格式错误%s:%s"%(Exception,e))

@app.route("/users", methods=['GET', 'POST'])
def users():
    if not g.user:
        return redirect(url_for('login'))
    if request.method == 'GET': 
        if g.user['priority_levels'] < 3:
            return render_template('Users.html') 
        else :
            userinfo=query_db("SELECT user_id,user_name,(case priority_levels when 1 then '普通用户' when 2 then '管理员' when 3 then '超级管理员' end) as user_level from hy_pbbms_users;")
            return render_template('Users.html',userinfo=userinfo) 
    elif request.method == 'POST': 
        if request.form.get("old_passwd"):
            error=""
            err_type=0
            user = query_db('select * from hy_pbbms_users where user_name = %s', [g.user['user_name']], one=True)
            if user is None:
                error = u'修改密码失败，请重新登录'
                err_type=4
            elif not check_password_hash(user['passwd'],
                                         request.form['old_passwd']):
                error =u'密码错误 ，重新输入'
                err_type=1
            elif request.form['new_passwd']!=request.form['ensure_passwd']:
                error =u'两次输入密码不一致'
                err_type=2
            else :
                res = query_none('update hy_pbbms_users set passwd=%s where user_name=%s'
                     ,[generate_password_hash(request.form['new_passwd']),g.user['user_name']])    
                if res==True:
                    err_type=0
                else:
                    err_type=3
                    error=u'密码修改失败，数据库错误'                
            return jsonify(err_type=err_type,error=error) 
        
        if g.user['priority_levels'] < 3:
            return jsonify(error=u'没有权限执行该操作',er_type=5)  
        
        if request.form.get("new_user") :
            if len(request.form['passwd'])<2:
                return jsonify(error=u"密码太短",er_type=2) 
            if (request.form['passwd'])!=(request.form['r_passwd']):
                return jsonify(error=u"密码不一致",er_type=3) 
            
            user = query_db('select user_id from hy_pbbms_users where user_name = %s;', [request.form['new_user']], one=True)
            if user :
                return jsonify(error=u"用户名重复",er_type=1) 
            
            new_user=request.form['new_user']
            level = int(request.form['user_level'])
            if(level==0):
                level=1
            passwd=request.form['passwd']
            res = query_none('insert into hy_pbbms_users values(0,%s,%s,%s)'
                     ,[new_user,passwd,level])
            if res==True:
                return jsonify(er_type=0)
            else:
                return jsonify(error=u'添加用户错误：数据库错误',er_type=4)   
        elif request.form.get("old_name"):
            error=""
            err_type=0
            level = int(request.form['user_level'])
            if(level==0):
                level=1
            if len(request.form['new_passwd'])>0:
                if len(request.form['new_passwd'])<2:
                    error=u"密码长度太短"
                    err_type=1
                    return jsonify(err_type=err_type,error=error)  
                elif request.form['new_passwd']!=request.form['new_passwd_r']:
                    error=u"两次输入密码不一致"
                    err_type=2
                    return jsonify(err_type=err_type,error=error)
                sql_str='update hy_pbbms_users set passwd=%s,priority_levels=%s where user_name=%s;'
                sql_list=[generate_password_hash(request.form['new_passwd']),level,request.form['old_name']]
                mess=u"修改用户密码与权限成功！"
            else :
                sql_str='update hy_pbbms_users set priority_levels=%s where user_name=%s;'
                sql_list=[level,request.form['old_name']]
                mess=u"修改用权限成功！"    
            res = query_none(sql_str, sql_list)
            if res==True:
                err_type=0
                error=mess
            else:
                err_type=3
                error=u'密码修改失败，数据库错误'                
            return jsonify(err_type=err_type,error=error)
        elif request.form.get("del_user"):
            res = query_none('delete from hy_pbbms_users where user_name=%s', [request.form['del_user']])
            if res==True:                
                return jsonify(mess=u"成功删除用户[%s]"%(request.form['del_user']))
            else:
                return jsonify(error=u"删除用户失败：数据库错误")
        else:
            return jsonify(error=u'未知错误',er_type=10)

if __name__ == '__main__':
    #query_db("update hy_pbbms_users set passwd=%s where user_name='test';",[generate_password_hash('test')])
    app.run(host="0.0.0.0",port=5004)


#@app.route('/login', methods=['GET', 'POST'])
#def login():
#    """Logs the user in."""
#    if g.user:
#        return redirect(url_for('timeline'))
#    error = None
#    if request.method == 'POST':
#        user = query_db('''select * from user where
#            username = ?''', [request.form['username']], one=True)
#        if user is None:
#            error = 'Invalid username'
#        elif not check_password_hash(user['pw_hash'],
#                                     request.form['password']):
#            error = 'Invalid password'
#        else:
#            flash('You were logged in')
#            session['user_id'] = user['user_id']
#            return redirect(url_for('timeline'))
#    return render_template('login.html', error=error)
