import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import * as path from 'path';
const qiniu = require('qiniu')
import { Config } from '../../config/env'
import { ReturnError } from 'src/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRes: Repository<Upload>
  ) { }
  //七牛
  async getUploadToken(key) {
    qiniu.conf.ACCESS_KEY = Config.accessKey
    qiniu.conf.SECRET_KEY = Config.secretKey
    const option = {
      scope: "002112",
      expires: 7200,
      returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
    }
    const mac = new qiniu.auth.digest.Mac(Config.accessKey, Config.secretKey);
    const putPolicy = new qiniu.rs.PutPolicy(option);
    const uploadToken = putPolicy.uploadToken(mac);
    const localFile = path.join(__dirname, `../public/static/${key}`);
    const formUploader = new qiniu.form_up.FormUploader(Config);
    const putExtra = new qiniu.form_up.PutExtra();
    return { formUploader, uploadToken, key, localFile, putExtra }

  }
  //上传至七牛云
  async UploadFile(file: Express.Multer.File): Promise<any> {
    const { formUploader, uploadToken, key, localFile, putExtra } = await this.getUploadToken(file.filename)
    // 文件上传
    const res = await formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,
      respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        return respBody
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
      }
    });

    if (res.resp.status == 200) {
      const url = await this.Download(res.data.key)
      const bool = await this.checkName(res.data.key)
      if (!bool) {
        const newparam: Partial<Upload> = await this.uploadRes.create({ url: url.DownloadUrl, urlName: res.data.key })
        await this.uploadRes.save(newparam)
      } else {
        console.log('已存在');
      }
      return { ...res.data, url: await this.Download(res.data.key) }
    } else {
      ReturnError('上传失败', 302)
    }
  }
  // 下载
  async Download(key): Promise<{ DownloadUrl: string }> {
    var mac = new qiniu.auth.digest.Mac(Config.accessKey, Config.secretKey);
    var config = new qiniu.conf.Config();
    var bucketManager = new qiniu.rs.BucketManager(mac, config);
    var privateBucketDomain = 'http://s85odxn8w.hn-bkt.clouddn.com';
    var deadline = parseInt(Date.now() / 1000 as any) + 3600; // 1小时过期
    var privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
    return { DownloadUrl: privateDownloadUrl }
  }

  // 删除文件
  async DeleteFile(key) {
    const bucket = "002112";
    const { accessKey, secretKey } = Config
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z0;
    const bucketManager = new qiniu.rs.BucketManager(mac, config);
    const res = await bucketManager.delete(bucket, key, function (err, respBody, respInfo) {
      if (err) {
        throw err;
      } else {
        if (respInfo.statusCode == 200) {
          return '删除成功'
        } else {
          return respBody
        }

      }
    });
  }


  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
  async checkName(urlName: string): Promise<boolean> {
    console.log("🚀 ~ UploadService ~ checkName ~ urlName:", urlName)
    const List = await this.uploadRes.findOne({ where: { urlName } })
    if (List) {
      return true
    } else {
      return false
    }
  }

}
