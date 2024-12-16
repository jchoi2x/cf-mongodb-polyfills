import type { SrvRecord } from 'node:dns';

interface DnsResponse {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question: {
    name: string;
    type: number;
  }[];
  Answer: {
    name: string;
    type: number;
    TTL: number;
    data: string;
  }[];
}
export async function resolveTxt(hostName: string) {
  try {
    console.log('resolveTxt called');
    const txtResp = await fetch(`https://cloudflare-dns.com/dns-query?name=${hostName}&type=TXT`, {
      headers: {
        Accept: 'application/dns-json',
      },
    }).then((res) => res.json<DnsResponse>());

    const answers = txtResp.Answer.map(({ data }) => [data.replace(/("|\\)/gm, '')]);
    return answers;
  } catch (err) {
    console.error('failed to retrieve txt records', err);
    return [];
  }
}

export async function resolveSrv(hostName: string) {
  try {
    console.log('resolveSrv called');
    const txtResp = await fetch(`https://cloudflare-dns.com/dns-query?name=${hostName}&type=SRV`, {
      headers: {
        Accept: 'application/dns-json',
      },
    }).then((res) => res.json<DnsResponse>());

    const answers: SrvRecord[] = txtResp.Answer.map(({ data }) => {
      const [priority, weight, port, name] = data.split(' ');
      return {
        name,
        port: parseInt(port, 10),
        priority: parseInt(priority, 10),
        weight: parseInt(weight, 10),
      };
    });

    return answers;
  } catch (err) {
    console.error('failed to retrieve txt records', err);
  }
}

export const promises = {
  resolveTxt: resolveTxt,
  resolveSrv: resolveSrv,
};
